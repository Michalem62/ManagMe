<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Stories, StoryFormData } from '@/types/Stories'

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
  <div class="card mb-4">
    <div class="card-header">{{ props.story ? 'Edit story' : 'New story' }}</div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label" for="storyName">Name</label>
            <input
              v-model="data.storyName"
              type="text"
              id="storyName"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label" for="priority">Priority</label>
            <select v-model="data.priority" id="priority" class="form-select">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label" for="storyDescription">Description</label>
            <textarea
              v-model="data.storyDescription"
              id="storyDescription"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>

          <div class="col-md-4">
            <label class="form-label" for="stan">State</label>
            <select v-model="data.stan" id="stan" class="form-select">
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </div>

          <div class="col-12 d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ props.story ? 'Save' : 'Add' }}
            </button>
            <button
              v-if="props.story"
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
