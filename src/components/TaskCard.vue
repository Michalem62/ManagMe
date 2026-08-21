<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/Task'
import { useUserStore } from '@/stores/userStore'
import { useStoryStore } from '@/stores/storyStore'
import PriorityBadge from './PriorityBadge.vue'

const userStore = useUserStore()
const storyStore = useStoryStore()

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  edit: [task: Task]
  'delete-task': [taskId: number]
}>()

const assignee = computed(() =>
  props.task.assigneeId === null ? null : userStore.getUserById(props.task.assigneeId),
)

const storyName = computed(
  () => storyStore.stories.find((story) => story.id === props.task.storyId)?.storyName ?? '—',
)
</script>
<template>
  <li class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <h6 class="card-title mb-0">{{ task.taskName }}</h6>
        <PriorityBadge :priority="task.priority" />
      </div>

      <p class="card-text small mt-2">{{ task.taskDescription }}</p>

      <p class="card-text text-body-secondary small mb-2">
        Story: {{ storyName }}<br />
        Estimated: {{ task.estimatedHours }}h<br />
        Assignee: {{ assignee ? userStore.fullName(assignee) : 'nobody' }}
      </p>

      <div class="d-flex gap-2">
        <RouterLink :to="`/task-details/${task.id}`" class="btn btn-sm btn-primary">
          Details
        </RouterLink>
        <button type="button" class="btn btn-sm btn-outline-primary" @click="emit('edit', task)">
          Edit
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="emit('delete-task', task.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
</template>
