import type { Stories } from '@/types/Stories'
import { saveAddedStory } from '@/services/storiesService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoryStore = defineStore('stories', () => {
  const storiesArray = ref<Stories[]>([])

  function addStory(story: Stories) {
    saveAddedStory(story)
  }

  return {
    storiesArray,
    addStory,
  }
})
