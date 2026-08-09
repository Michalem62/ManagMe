<script setup lang="ts">
import type { Stories } from '@/types/Stories'

const props = defineProps<{
  story: Stories
}>()

const emit = defineEmits<{
  edit: [story: Stories]
  'delete-story': [storyId: number]
  'change-state': [storyId: number, stan: Stories['stan']]
}>()

function handleStateChange(event: Event) {
  emit('change-state', props.story.id, (event.target as HTMLSelectElement).value as Stories['stan'])
}
</script>
<template>
  <li class="story-card">
    <strong>{{ story.storyName }}</strong>
    <p>{{ story.storyDescription }}</p>
    <p>Priority: {{ story.priority }}</p>
    <p>Created: {{ new Date(story.createDate).toLocaleString() }}</p>

    <select :value="story.stan" @change="handleStateChange">
      <option value="todo">todo</option>
      <option value="doing">doing</option>
      <option value="done">done</option>
    </select>

    <input type="button" value="Edit" @click="emit('edit', story)" />
    <input type="button" value="Delete" @click="emit('delete-story', story.id)" />
  </li>
</template>
<style scoped>
.story-card {
  border: 1px solid black;
  padding: 5px;
  margin-bottom: 5px;
  list-style: none;
}
</style>
