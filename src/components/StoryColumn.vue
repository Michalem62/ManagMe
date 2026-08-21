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
  <div class="col">
    <div class="card h-100 bg-body-tertiary">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold">{{ title }}</span>
        <span class="badge text-bg-secondary">{{ stories.length }}</span>
      </div>
      <div class="card-body">
        <p v-if="stories.length === 0" class="text-body-secondary small mb-0">No stories</p>
        <ul v-else class="list-unstyled d-flex flex-column gap-2 mb-0">
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
    </div>
  </div>
</template>
