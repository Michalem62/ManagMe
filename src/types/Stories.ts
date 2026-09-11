export interface Stories {
  id: number
  storyName: string
  storyDescription: string
  priority: 'low' | 'medium' | 'high'
  projectId: number
  createDate: string
  stan: 'todo' | 'doing' | 'done'
  ownerId: number
}

export type StoryFormData = Omit<Stories, 'id' | 'projectId' | 'createDate' | 'ownerId'>
