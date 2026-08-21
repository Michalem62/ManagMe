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
  <div class="col">
    <div class="card h-100 bg-body-tertiary">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold">{{ title }}</span>
        <span class="badge text-bg-secondary">{{ tasks.length }}</span>
      </div>
      <div class="card-body">
        <p v-if="tasks.length === 0" class="text-body-secondary small mb-0">No tasks</p>
        <ul v-else class="list-unstyled d-flex flex-column gap-2 mb-0">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @edit="emit('edit', $event)"
            @delete-task="emit('delete-task', $event)"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
