<script setup lang="ts">
import type { Task } from '@/types/Task'
import TaskCard from './TaskCard.vue'

defineProps<{
  title: string
  tasks: Task[]
}>()

const emit = defineEmits<{
  edit: [task: Task]
  'delete-task': [taskId: number]
}>()
</script>
<template>
  <div class="column">
    <h3>{{ title }} ({{ tasks.length }})</h3>
    <p v-if="tasks.length === 0">No tasks</p>
    <ul v-else>
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete-task="emit('delete-task', $event)"
      />
    </ul>
  </div>
</template>
<style scoped>
.column {
  border: 1px solid black;
  padding: 5px;
  flex: 1;
}

ul {
  padding: 0;
}
</style>
