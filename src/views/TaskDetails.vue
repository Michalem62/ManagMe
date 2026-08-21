<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStoryStore } from '@/stores/storyStore'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import PriorityBadge from '@/components/PriorityBadge.vue'
import StateBadge from '@/components/StateBadge.vue'

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
    <h1 class="h3 mb-4">Task details</h1>

    <p v-if="isLoading" class="text-body-secondary">Ładowanie…</p>
    <div v-else-if="!task" class="alert alert-warning">Nie znaleziono zadania o id {{ id }}.</div>

    <template v-else>
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center gap-2">
          <span class="fw-semibold">{{ task.taskName }}</span>
          <span class="d-flex gap-2">
            <PriorityBadge :priority="task.priority" />
            <StateBadge :stan="task.stan" />
          </span>
        </div>

        <div class="card-body">
          <dl class="row mb-0">
            <dt class="col-sm-3">Description</dt>
            <dd class="col-sm-9">{{ task.taskDescription }}</dd>

            <dt class="col-sm-3">Story</dt>
            <dd class="col-sm-9">{{ story ? story.storyName : '—' }}</dd>

            <dt class="col-sm-3">Estimated</dt>
            <dd class="col-sm-9">{{ task.estimatedHours }}h</dd>

            <dt class="col-sm-3">Worked hours</dt>
            <dd class="col-sm-9">{{ worked === null ? '—' : `${worked}h` }}</dd>

            <dt class="col-sm-3">Created</dt>
            <dd class="col-sm-9">{{ formatDate(task.createDate) }}</dd>

            <dt class="col-sm-3">Started</dt>
            <dd class="col-sm-9">{{ formatDate(task.startDate) }}</dd>

            <dt class="col-sm-3">Finished</dt>
            <dd class="col-sm-9">{{ formatDate(task.endDate) }}</dd>

            <dt class="col-sm-3">Assignee</dt>
            <dd class="col-sm-9 mb-0">
              {{ assignee ? userStore.fullName(assignee) : 'nobody' }}
            </dd>
          </dl>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">Actions</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label" for="assignee">Assign person</label>
            <select
              :value="task.assigneeId ?? 0"
              id="assignee"
              class="form-select"
              @change="handleAssign"
            >
              <option :value="0">nobody</option>
              <option v-for="user in userStore.assignableUsers" :key="user.id" :value="user.id">
                {{ userStore.fullName(user) }} ({{ user.role }})
              </option>
            </select>
            <div class="form-text">
              Przypisanie osoby przenosi zadanie do „doing" i uzupełnia datę startu. Zdjęcie osoby
              cofa je do „todo".
            </div>
          </div>

          <button
            v-if="task.stan === 'doing'"
            type="button"
            class="btn btn-success"
            @click="handleDone"
          >
            Mark as done
          </button>
          <button
            v-else-if="task.stan === 'done'"
            type="button"
            class="btn btn-outline-primary"
            @click="handleReopen"
          >
            Reopen (back to doing)
          </button>
        </div>
      </div>
    </template>

    <RouterLink to="/tasks" class="btn btn-outline-secondary">Back to tasks</RouterLink>
  </main>
</template>
