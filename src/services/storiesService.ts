import type { Stories } from '@/types/Stories'

const STORY_KEY = 'stories'
const NEXT_ID_KEY = 'next_story_id'
const actualDate: Date = new Date()

export function getStories(): Stories[] {
  const stories = localStorage.getItem(STORY_KEY)

  if (!stories) return []

  return JSON.parse(stories) as Stories[]
}

function saveStories(stories: Stories[]): void {
  localStorage.setItem(STORY_KEY, JSON.stringify(stories))
}

function getNextStoryId(): number {
  const stories = getStories()
  const savedNextId = Number(localStorage.getItem(NEXT_ID_KEY))

  const nextId = savedNextId || getMaxStoryId(stories) + 1

  localStorage.setItem(NEXT_ID_KEY, String(nextId + 1))

  return nextId
}

function getMaxStoryId(stories: Stories[]): number {
  if (!stories.length) return 0

  return Math.max(...stories.map((project) => project.id))
}

export function saveAddedStory(stories: Stories) {
  const getAllStories = getStories()

  const newStory: Stories = {
    id: getNextStoryId(),
    storyName: stories.storyName,
    storyDescription: stories.storyDescription,
    priority: stories.priority,
    project: stories.project,
    createDate: actualDate,
    stan: stories.stan,
    ownerId: stories.ownerId,
  }

  getAllStories.push(newStory)
  saveStories(getAllStories)
}
