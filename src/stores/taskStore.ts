import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskFormData } from '@/types/Task'
import type { NotificationDraft } from '@/types/Notification'
import { taskApi } from '@/api'
import { useStoryStore } from './storyStore'
import { useNotificationStore } from './notificationStore'
import { useUserStore } from './userStore'

export const useTaskStore = defineStore('tasks', () => {
  const storyStore = useStoryStore()

  const tasks = ref<Task[]>([])

  // Zadanie należy do projektu przez historyjkę — filtrujemy po historyjkach aktywnego projektu.
  const tasksByProject = computed(() => {
    const storyIds = new Set(storyStore.storiesByProject.map((story) => story.id))

    return tasks.value.filter((task) => storyIds.has(task.storyId))
  })

  async function fetchTasks(): Promise<void> {
    tasks.value = await taskApi.getAll()
  }

  async function getTaskById(id: number): Promise<Task | null> {
    return taskApi.getById(id)
  }

  async function addTask(taskData: TaskFormData): Promise<void> {
    await taskApi.create({
      ...taskData,
      stan: 'todo',
      createDate: new Date().toISOString(),
      startDate: null,
      endDate: null,
      assigneeId: null,
    })

    await fetchTasks()

    // Nowe zadanie w zamkniętej historyjce znaczy, że nie jest już zamknięta.
    await reopenStoryIfDone(taskData.storyId)

    await notifyStoryOwner(taskData.storyId, {
      title: 'Nowe zadanie',
      message: `Zadanie „${taskData.taskName}" dodane do historyjki „${storyName(taskData.storyId)}".`,
      priority: 'medium',
    })
  }

  async function editTask(task: Task): Promise<void> {
    // Edycja może przenieść zadanie do innej historyjki — obie trzeba wtedy przeliczyć.
    // Wywołania wewnętrzne (przypisanie osoby, zmiana stanu) nigdy nie ruszają storyId.
    const previousStoryId = tasks.value.find((item) => item.id === task.id)?.storyId

    await taskApi.update(task)
    await fetchTasks()

    if (previousStoryId !== undefined && previousStoryId !== task.storyId) {
      await closeStoryIfAllTasksDone(previousStoryId)
      await reopenStoryIfDone(task.storyId)
    }
  }

  async function removeTask(id: number): Promise<void> {
    const task = tasks.value.find((item) => item.id === id)

    await taskApi.delete(id)
    await fetchTasks()

    if (!task) return

    // Usunięcie ostatniego niezamkniętego zadania może domknąć historyjkę.
    await closeStoryIfAllTasksDone(task.storyId)

    await notifyStoryOwner(task.storyId, {
      title: 'Usunięto zadanie',
      message: `Zadanie „${task.taskName}" usunięte z historyjki „${storyName(task.storyId)}".`,
      priority: 'medium',
    })
  }

  // Przypisanie osoby: todo → doing wraz z datą startu (wymaganie wprost).
  async function assignUser(taskId: number, userId: number): Promise<void> {
    const task = tasks.value.find((item) => item.id === taskId)

    if (!task) return

    const wasTodo = task.stan === 'todo'

    await editTask({
      ...task,
      assigneeId: userId,
      stan: wasTodo ? 'doing' : task.stan,
      startDate: task.startDate ?? new Date().toISOString(),
    })

    if (wasTodo) await startStoryIfTodo(task.storyId)

    const user = useUserStore().getUserById(userId)
    const notificationStore = useNotificationStore()

    await notificationStore.send({
      title: 'Przypisano Cię do zadania',
      message: `Zadanie „${task.taskName}" w historyjce „${storyName(task.storyId)}" czeka na Ciebie.`,
      priority: 'high',
      recipientId: userId,
    })

    // Kopia do właściciela historyjki — bez niej przypisanie byłoby niewidoczne dla nikogo
    // poza wykonawcą. Przy przypisaniu do samego siebie wystarczy jedno powiadomienie.
    await notifyStoryOwner(
      task.storyId,
      {
        title: 'Przypisano osobę do zadania',
        message: `${user ? useUserStore().fullName(user) : 'Ktoś'} został przypisany do zadania „${task.taskName}".`,
        priority: 'high',
      },
      userId,
    )
  }

  // Odpięcie osoby cofa zadanie do todo — stan doing wymaga przypisanego użytkownika.
  async function unassignUser(taskId: number): Promise<void> {
    const task = tasks.value.find((item) => item.id === taskId)

    if (!task) return

    await editTask({ ...task, assigneeId: null, stan: 'todo', startDate: null, endDate: null })
    await reopenStoryIfDone(task.storyId)
  }

  async function changeState(taskId: number, stan: Task['stan']): Promise<void> {
    const task = tasks.value.find((item) => item.id === taskId)

    if (!task || task.stan === stan) return

    if (stan !== 'todo' && task.assigneeId === null) {
      throw new Error('Zadanie wymaga przypisanej osoby, zanim zmieni stan')
    }

    const now = new Date().toISOString()

    if (stan === 'todo') {
      // Powrót na początek czyści wszystko, co dokłada automatyka.
      await editTask({ ...task, stan, assigneeId: null, startDate: null, endDate: null })
      await reopenStoryIfDone(task.storyId)
      return
    }

    if (stan === 'doing') {
      await editTask({ ...task, stan, startDate: task.startDate ?? now, endDate: null })
      await reopenStoryIfDone(task.storyId)
      await startStoryIfTodo(task.storyId)

      await notifyStoryOwner(task.storyId, {
        title: 'Zadanie w toku',
        message: `Zadanie „${task.taskName}" w historyjce „${storyName(task.storyId)}" jest realizowane.`,
        priority: 'low',
      })
      return
    }

    await editTask({ ...task, stan, startDate: task.startDate ?? now, endDate: now })
    await closeStoryIfAllTasksDone(task.storyId)

    await notifyStoryOwner(task.storyId, {
      title: 'Zadanie zakończone',
      message: `Zadanie „${task.taskName}" w historyjce „${storyName(task.storyId)}" zostało zakończone.`,
      priority: 'medium',
    })
  }

  // Kasowanie sekwencyjne — równoległe usuwanie nadpisywałoby sobie zapisy w storage.
  async function removeTasksOfStory(storyId: number): Promise<void> {
    const all = await taskApi.getAll()

    for (const task of all.filter((item) => item.storyId === storyId)) {
      await taskApi.delete(task.id)
    }

    await fetchTasks()
  }

  function tasksOfStory(storyId: number): Task[] {
    return tasks.value.filter((task) => task.storyId === storyId)
  }

  // Zrealizowane roboczogodziny liczone z dat: start → koniec, dla trwających start → teraz.
  function workedHours(task: Task): number | null {
    if (!task.startDate) return null

    const end = task.endDate ? new Date(task.endDate) : new Date()
    const hours = (end.getTime() - new Date(task.startDate).getTime()) / 3_600_000

    return Math.round(hours * 10) / 10
  }

  function storyName(storyId: number): string {
    return storyStore.stories.find((item) => item.id === storyId)?.storyName ?? '—'
  }

  // Cztery z pięciu powiadomień idą do właściciela historyjki, więc adresowanie siedzi
  // w jednym miejscu. notificationStore wołany dopiero tutaj — kierunek importów.
  async function notifyStoryOwner(
    storyId: number,
    draft: Omit<NotificationDraft, 'recipientId'>,
    skipIfOwnerIs?: number,
  ): Promise<void> {
    const story = storyStore.stories.find((item) => item.id === storyId)

    if (!story || story.ownerId === skipIfOwnerIs) return

    await useNotificationStore().send({ ...draft, recipientId: story.ownerId })
  }

  async function startStoryIfTodo(storyId: number): Promise<void> {
    const story = storyStore.stories.find((item) => item.id === storyId)

    if (story?.stan === 'todo') await storyStore.changeState(storyId, 'doing')
  }

  // Historyjka bez zadań nigdy nie domyka się automatycznie — tylko ręcznie w StoryForm.
  async function closeStoryIfAllTasksDone(storyId: number): Promise<void> {
    const story = storyStore.stories.find((item) => item.id === storyId)
    const storyTasks = tasksOfStory(storyId)

    if (!story || story.stan === 'done' || storyTasks.length === 0) return

    if (storyTasks.every((task) => task.stan === 'done')) {
      await storyStore.changeState(storyId, 'done')
    }
  }

  async function reopenStoryIfDone(storyId: number): Promise<void> {
    const story = storyStore.stories.find((item) => item.id === storyId)

    if (story?.stan === 'done') await storyStore.changeState(storyId, 'doing')
  }

  return {
    tasks,
    tasksByProject,
    fetchTasks,
    getTaskById,
    addTask,
    editTask,
    removeTask,
    assignUser,
    unassignUser,
    changeState,
    removeTasksOfStory,
    tasksOfStory,
    workedHours,
  }
})
