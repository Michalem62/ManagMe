<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Stories, StoryFormData } from '@/types/Stories'

// Brak propa story = tryb dodawania, prop story = tryb edycji.
const props = defineProps<{
  story?: Stories | null
}>()

const emit = defineEmits<{
  submit: [story: StoryFormData]
  cancel: []
}>()

function emptyForm(): StoryFormData {
  return {
    storyName: '',
    storyDescription: '',
    priority: 'medium',
    stan: 'todo',
  }
}

const data = ref<StoryFormData>(emptyForm())

// Kliknięcie "Edit" na innej karcie musi przeładować formularz danymi tej historyjki.
watch(
  () => props.story,
  (story) => {
    data.value = story
      ? {
          storyName: story.storyName,
          storyDescription: story.storyDescription,
          priority: story.priority,
          stan: story.stan,
        }
      : emptyForm()
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', { ...data.value })

  if (!props.story) data.value = emptyForm()
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h3>{{ props.story ? 'Edit story' : 'New story' }}</h3>

    <label for="storyName">Name</label><br />
    <input v-model="data.storyName" type="text" id="storyName" required /><br />

    <label for="storyDescription">Description</label><br />
    <textarea v-model="data.storyDescription" id="storyDescription" required></textarea><br />

    <label for="priority">Priority</label><br />
    <select v-model="data.priority" id="priority">
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option></select
    ><br />

    <label for="stan">State</label><br />
    <select v-model="data.stan" id="stan">
      <option value="todo">todo</option>
      <option value="doing">doing</option>
      <option value="done">done</option></select
    ><br />

    <input type="submit" :value="props.story ? 'save' : 'add'" />
    <input v-if="props.story" type="button" value="cancel" @click="emit('cancel')" />
  </form>
</template>
