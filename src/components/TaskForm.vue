<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskFormData } from '@/types/Task'
import { useStoryStore } from '@/stores/storyStore'

const storyStore = useStoryStore()

// Brak propa task = tryb dodawania, prop task = tryb edycji.
const props = defineProps<{
  task?: Task | null
}>()

const emit = defineEmits<{
  submit: [task: TaskFormData]
  cancel: []
}>()

function emptyForm(): TaskFormData {
  return {
    taskName: '',
    taskDescription: '',
    priority: 'medium',
    // Pierwsza historyjka projektu jako domyślna — formularz i tak pokazuje się dopiero,
    // gdy jakaś istnieje. 0 to wariant awaryjny, odsiewany przy submicie.
    storyId: storyStore.storiesByProject[0]?.id ?? 0,
    estimatedHours: 1,
  }
}

const data = ref<TaskFormData>(emptyForm())

watch(
  () => props.task,
  (task) => {
    data.value = task
      ? {
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          priority: task.priority,
          storyId: task.storyId,
          estimatedHours: task.estimatedHours,
        }
      : emptyForm()
  },
  { immediate: true },
)

function handleSubmit() {
  // Atrybut required nie zadziała na selekcie, którego wartością jest liczba 0.
  if (data.value.storyId === 0) return

  emit('submit', { ...data.value })

  if (!props.task) data.value = emptyForm()
}
</script>
<template>
  <div class="card mb-4">
    <div class="card-header">{{ props.task ? 'Edit task' : 'New task' }}</div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label" for="taskName">Name</label>
            <input
              v-model="data.taskName"
              type="text"
              id="taskName"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label" for="taskPriority">Priority</label>
            <select v-model="data.priority" id="taskPriority" class="form-select">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label" for="taskDescription">Description</label>
            <textarea
              v-model="data.taskDescription"
              id="taskDescription"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>

          <div class="col-md-8">
            <label class="form-label" for="taskStory">Story</label>
            <select v-model.number="data.storyId" id="taskStory" class="form-select">
              <option v-if="data.storyId === 0" :value="0" disabled>Choose a story</option>
              <option
                v-for="story in storyStore.storiesByProject"
                :key="story.id"
                :value="story.id"
              >
                {{ story.storyName }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label" for="estimatedHours">Estimated hours</label>
            <input
              v-model.number="data.estimatedHours"
              type="number"
              id="estimatedHours"
              class="form-control"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div class="col-12 d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ props.task ? 'Save' : 'Add' }}
            </button>
            <button
              v-if="props.task"
              type="button"
              class="btn btn-outline-secondary"
              @click="emit('cancel')"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
