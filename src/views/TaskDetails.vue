<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStoryStore } from '@/stores/storyStore'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'

const storyStore = useStoryStore()
const taskStore = useTaskStore()
const userStore = useUserStore()

const props = defineProps<{
  id: number
}>()

const isLoading = ref(true)

onMounted(async () => {
  await storyStore.fetchStories()
  await taskStore.fetchTasks()
  isLoading.value = false
})

// Czytamy ze store'a, a nie z lokalnego ref — dzięki temu widok odświeża się sam
// po przypisaniu osoby czy zmianie stanu.
const task = computed(() => taskStore.tasks.find((item) => item.id === props.id) ?? null)

const story = computed(() =>
  task.value === null
    ? null
    : (storyStore.stories.find((item) => item.id === task.value?.storyId) ?? null),
)

const assignee = computed(() =>
  task.value === null || task.value.assigneeId === null
    ? null
    : userStore.getUserById(task.value.assigneeId),
)

const worked = computed(() => (task.value === null ? null : taskStore.workedHours(task.value)))

function formatDate(date: string | null): string {
  return date ? new Date(date).toLocaleString() : '—'
}

async function handleAssign(event: Event) {
  const userId = Number((event.target as HTMLSelectElement).value)

  if (task.value === null) return

  if (userId === 0) {
    await taskStore.unassignUser(task.value.id)
    return
  }

  await taskStore.assignUser(task.value.id, userId)
}

async function handleDone() {
  if (task.value) await taskStore.changeState(task.value.id, 'done')
}

async function handleReopen() {
  if (task.value) await taskStore.changeState(task.value.id, 'doing')
}
</script>
<template>
  <main>
    <h1>Task details</h1>

    <p v-if="isLoading">Ładowanie…</p>
    <p v-else-if="!task">Nie znaleziono zadania o id {{ id }}.</p>

    <template v-else>
      <h2>{{ task.taskName }}</h2>
      <p><strong>Description:</strong> {{ task.taskDescription }}</p>
      <p><strong>Story:</strong> {{ story ? story.storyName : '—' }}</p>
      <p><strong>Priority:</strong> {{ task.priority }}</p>
      <p><strong>State:</strong> {{ task.stan }}</p>
      <p><strong>Estimated:</strong> {{ task.estimatedHours }}h</p>
      <p><strong>Worked hours:</strong> {{ worked === null ? '—' : `${worked}h` }}</p>
      <p><strong>Created:</strong> {{ formatDate(task.createDate) }}</p>
      <p><strong>Started:</strong> {{ formatDate(task.startDate) }}</p>
      <p><strong>Finished:</strong> {{ formatDate(task.endDate) }}</p>
      <p><strong>Assignee:</strong> {{ assignee ? userStore.fullName(assignee) : 'nobody' }}</p>

      <label for="assignee">Assign person</label><br />
      <select :value="task.assigneeId ?? 0" id="assignee" @change="handleAssign">
        <option :value="0">nobody</option>
        <option v-for="user in userStore.assignableUsers" :key="user.id" :value="user.id">
          {{ userStore.fullName(user) }} ({{ user.role }})
        </option>
      </select>
      <p class="hint">
        Przypisanie osoby przenosi zadanie do „doing" i uzupełnia datę startu. Zdjęcie osoby
        cofa je do „todo".
      </p>

      <p v-if="task.stan === 'doing'">
        <input type="button" value="Mark as done" @click="handleDone" />
      </p>
      <p v-else-if="task.stan === 'done'">
        <input type="button" value="Reopen (back to doing)" @click="handleReopen" />
      </p>
    </template>

    <RouterLink to="/tasks">Back to tasks</RouterLink>
  </main>
</template>
<style scoped>
.hint {
  font-size: 0.85em;
  color: #555;
}
</style>
