export interface Project {
  id: number
  name: string
  description: string
}

export type ProjectFormData = Omit<Project, 'id'>
