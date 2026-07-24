import type { Project } from './Project'
import type { User } from './User'

export interface Stories {
  id: number
  storyName: string
  storyDescription: string
  priority: 'low' | 'medium' | 'high'
  project: Project
  createDate: Date
  stan: 'todo' | 'doing' | 'done'
  ownerId: User
}
