export interface Stories {
  id: number
  storyName: string
  storyDescription: string
  priority: 'low' | 'medium' | 'high'
  projectId: number
  // ISO string, nie Date — po JSON.parse i tak wraca string, a TS by tego nie wychwycił
  createDate: string
  stan: 'todo' | 'doing' | 'done'
  ownerId: number
}

// To, co faktycznie wypełnia użytkownik. Resztę pól dokłada store.
export type StoryFormData = Omit<Stories, 'id' | 'projectId' | 'createDate' | 'ownerId'>
