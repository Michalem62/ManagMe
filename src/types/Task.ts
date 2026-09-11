export interface Task {
  id: number
  taskName: string
  taskDescription: string
  priority: 'low' | 'medium' | 'high'
  storyId: number
  estimatedHours: number
  stan: 'todo' | 'doing' | 'done'
  createDate: string
  startDate: string | null
  endDate: string | null
  assigneeId: number | null
}

export type TaskFormData = Omit<
  Task,
  'id' | 'stan' | 'createDate' | 'startDate' | 'endDate' | 'assigneeId'
>
