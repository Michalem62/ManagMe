<script setup lang="ts">
import type { Stories } from '@/types/Stories'
import PriorityBadge from './PriorityBadge.vue'

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
  <li class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <h6 class="card-title mb-0">{{ story.storyName }}</h6>
        <PriorityBadge :priority="story.priority" />
      </div>

      <p class="card-text small mt-2">{{ story.storyDescription }}</p>
      <p class="card-text text-body-secondary small">
        Created: {{ new Date(story.createDate).toLocaleString() }}
      </p>

      <select
        class="form-select form-select-sm mb-2"
        :value="story.stan"
        @change="handleStateChange"
      >
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>

      <div class="d-flex gap-2">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="emit('edit', story)">
          Edit
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="emit('delete-story', story.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
</template>
