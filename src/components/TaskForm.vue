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
  <form @submit.prevent="handleSubmit">
    <h3>{{ props.task ? 'Edit task' : 'New task' }}</h3>

    <label for="taskName">Name</label><br />
    <input v-model="data.taskName" type="text" id="taskName" required /><br />

    <label for="taskDescription">Description</label><br />
    <textarea v-model="data.taskDescription" id="taskDescription" required></textarea><br />

    <label for="taskStory">Story</label><br />
    <select v-model.number="data.storyId" id="taskStory">
      <option v-if="data.storyId === 0" :value="0" disabled>Choose a story</option>
      <option v-for="story in storyStore.storiesByProject" :key="story.id" :value="story.id">
        {{ story.storyName }}
      </option></select
    ><br />

    <label for="taskPriority">Priority</label><br />
    <select v-model="data.priority" id="taskPriority">
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option></select
    ><br />

    <label for="estimatedHours">Estimated hours</label><br />
    <input
      v-model.number="data.estimatedHours"
      type="number"
      id="estimatedHours"
      min="0"
      step="0.5"
      required
    /><br />

    <input type="submit" :value="props.task ? 'save' : 'add'" />
    <input v-if="props.task" type="button" value="cancel" @click="emit('cancel')" />
  </form>
</template>
