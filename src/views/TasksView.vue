<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskColumn from '@/components/TaskColumn.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useStoryStore } from '@/stores/storyStore'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, TaskFormData } from '@/types/Task'

const projectStore = useProjectStore()
const storyStore = useStoryStore()
const taskStore = useTaskStore()

const editedTask = ref<Task | null>(null)
// 0 = bez filtra, pokazujemy zadania wszystkich historyjek projektu
const storyFilter = ref(0)

onMounted(async () => {
  await storyStore.fetchStories()
  await taskStore.fetchTasks()
})

// Wybór projektu przeniósł się do nagłówka. Filtr wskazuje historyjkę starego projektu,
// a formularz mógł zostać w trybie edycji — jedno i drugie trzeba wyczyścić.
watch(
  () => projectStore.activeProjectId,
  () => {
    editedTask.value = null
    storyFilter.value = 0
  },
)

const visibleTasks = computed(() =>
  storyFilter.value === 0
    ? taskStore.tasksByProject
    : taskStore.tasksByProject.filter((task) => task.storyId === storyFilter.value),
)

const todo = computed(() => visibleTasks.value.filter((task) => task.stan === 'todo'))
const doing = computed(() => visibleTasks.value.filter((task) => task.stan === 'doing'))
const done = computed(() => visibleTasks.value.filter((task) => task.stan === 'done'))

async function handleSubmit(taskData: TaskFormData) {
  if (editedTask.value) {
    await taskStore.editTask({ ...editedTask.value, ...taskData })
    editedTask.value = null
  } else {
    await taskStore.addTask(taskData)
  }
}

async function handleDelete(id: number) {
  if (editedTask.value?.id === id) editedTask.value = null

  await taskStore.removeTask(id)
}
</script>
<template>
  <main>
    <h1>Tasks</h1>

    <p v-if="!projectStore.activeProject">Wybierz aktywny projekt, żeby zobaczyć zadania.</p>

    <template v-else>
      <p>Project: {{ projectStore.activeProject.name }}</p>

      <p v-if="storyStore.storiesByProject.length === 0">
        Ten projekt nie ma jeszcze historyjek — zadanie musi należeć do historyjki.
      </p>

      <template v-else>
        <TaskForm :task="editedTask" @submit="handleSubmit" @cancel="editedTask = null" />

        <label for="storyFilter">Story:</label>
        <select v-model.number="storyFilter" id="storyFilter">
          <option :value="0">all</option>
          <option v-for="story in storyStore.storiesByProject" :key="story.id" :value="story.id">
            {{ story.storyName }}
          </option>
        </select>

        <div class="columns">
          <TaskColumn
            title="Todo"
            :tasks="todo"
            @edit="editedTask = $event"
            @delete-task="handleDelete"
          />
          <TaskColumn
            title="Doing"
            :tasks="doing"
            @edit="editedTask = $event"
            @delete-task="handleDelete"
          />
          <TaskColumn
            title="Done"
            :tasks="done"
            @edit="editedTask = $event"
            @delete-task="handleDelete"
          />
        </div>
      </template>
    </template>

    <RouterLink to="/stories">Back to stories</RouterLink>
  </main>
</template>
<style scoped>
.columns {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
</style>
