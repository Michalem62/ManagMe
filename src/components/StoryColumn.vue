<script setup lang="ts">
import type { Stories } from '@/types/Stories'
import StoryCard from './StoryCard.vue'

defineProps<{
  title: string
  stories: Stories[]
}>()

const emit = defineEmits<{
  edit: [story: Stories]
  'delete-story': [storyId: number]
  'change-state': [storyId: number, stan: Stories['stan']]
}>()
</script>
<template>
  <div class="column">
    <h3>{{ title }} ({{ stories.length }})</h3>
    <p v-if="stories.length === 0">No stories</p>
    <ul v-else>
      <StoryCard
        v-for="story in stories"
        :key="story.id"
        :story="story"
        @edit="emit('edit', $event)"
        @delete-story="emit('delete-story', $event)"
        @change-state="(id, stan) => emit('change-state', id, stan)"
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
