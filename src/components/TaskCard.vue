<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/Task'
import { useUserStore } from '@/stores/userStore'
import { useStoryStore } from '@/stores/storyStore'

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
  <li class="task-card">
    <strong>{{ task.taskName }}</strong>
    <p>{{ task.taskDescription }}</p>
    <p>Story: {{ storyName }}</p>
    <p>Priority: {{ task.priority }}</p>
    <p>Estimated: {{ task.estimatedHours }}h</p>
    <p>Assignee: {{ assignee ? userStore.fullName(assignee) : 'nobody' }}</p>

    <RouterLink :to="`/task-details/${task.id}`">Details</RouterLink>

    <input type="button" value="Edit" @click="emit('edit', task)" />
    <input type="button" value="Delete" @click="emit('delete-task', task.id)" />
  </li>
</template>
<style scoped>
.task-card {
  border: 1px solid black;
  padding: 5px;
  margin-bottom: 5px;
  list-style: none;
}
</style>
