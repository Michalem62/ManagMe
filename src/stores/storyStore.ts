import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stories, StoryFormData } from '@/types/Stories'
import { storyApi } from '@/api'
import { useProjectStore } from './projectStore'
import { useUserStore } from './userStore'

export const useStoryStore = defineStore('stories', () => {
  const projectStore = useProjectStore()
  const userStore = useUserStore()

  const stories = ref<Stories[]>([])

  // Wszystko, co widać w aplikacji, dotyczy wyłącznie aktywnego projektu.
  const storiesByProject = computed(() =>
    projectStore.activeProjectId === null
      ? []
      : stories.value.filter((story) => story.projectId === projectStore.activeProjectId),
  )

  const todo = computed(() => storiesByProject.value.filter((story) => story.stan === 'todo'))
  const doing = computed(() => storiesByProject.value.filter((story) => story.stan === 'doing'))
  const done = computed(() => storiesByProject.value.filter((story) => story.stan === 'done'))

  async function fetchStories(): Promise<void> {
    stories.value = await storyApi.getAll()
  }

  async function getStoryById(id: number): Promise<Stories | null> {
    return storyApi.getById(id)
  }

  async function addStory(storyData: StoryFormData): Promise<void> {
    if (projectStore.activeProjectId === null) {
      throw new Error('Nie można dodać historyjki bez wybranego aktywnego projektu')
    }

    await storyApi.create({
      ...storyData,
      projectId: projectStore.activeProjectId,
      createDate: new Date().toISOString(),
      ownerId: userStore.currentUser.id,
    })

    await fetchStories()
  }

  async function editStory(story: Stories): Promise<void> {
    await storyApi.update(story)
    await fetchStories()
  }

  async function removeStory(id: number): Promise<void> {
    await storyApi.delete(id)
    await fetchStories()
  }

  async function changeState(id: number, stan: Stories['stan']): Promise<void> {
    const story = stories.value.find((item) => item.id === id)

    if (!story) return

    await editStory({ ...story, stan })
  }

  // Kasowanie sekwencyjne — równoległe usuwanie nadpisywałoby sobie zapisy w storage.
  async function removeStoriesOfProject(projectId: number): Promise<void> {
    const all = await storyApi.getAll()

    for (const story of all.filter((item) => item.projectId === projectId)) {
      await storyApi.delete(story.id)
    }

    await fetchStories()
  }

  return {
    stories,
    storiesByProject,
    todo,
    doing,
    done,
    fetchStories,
    getStoryById,
    addStory,
    editStory,
    removeStory,
    changeState,
    removeStoriesOfProject,
  }
})
