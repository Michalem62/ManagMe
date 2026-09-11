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
const storyFilter = ref(0)

onMounted(async () => {
  await storyStore.fetchStories()
  await taskStore.fetchTasks()
})

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
    <h1 class="h3 mb-1">Tasks</h1>

    <div v-if="!projectStore.activeProject" class="alert alert-warning">
      Wybierz aktywny projekt, żeby zobaczyć zadania.
    </div>

    <template v-else>
      <p class="text-body-secondary mb-4">Project: {{ projectStore.activeProject.name }}</p>

      <div v-if="storyStore.storiesByProject.length === 0" class="alert alert-info">
        Ten projekt nie ma jeszcze historyjek — zadanie musi należeć do historyjki.
      </div>

      <template v-else>
        <TaskForm :task="editedTask" @submit="handleSubmit" @cancel="editedTask = null" />

        <div class="d-flex align-items-center gap-2 mb-3">
          <label class="form-label mb-0" for="storyFilter">Story:</label>
          <select v-model.number="storyFilter" id="storyFilter" class="form-select w-auto">
            <option :value="0">all</option>
            <option v-for="story in storyStore.storiesByProject" :key="story.id" :value="story.id">
              {{ story.storyName }}
            </option>
          </select>
        </div>

        <div class="row row-cols-1 row-cols-lg-3 g-3">
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

    <RouterLink to="/stories" class="btn btn-outline-secondary mt-4">Back to stories</RouterLink>
  </main>
</template>
