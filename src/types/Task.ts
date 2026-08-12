export interface Task {
  id: number
  taskName: string
  taskDescription: string
  priority: 'low' | 'medium' | 'high'
  storyId: number
  // Przewidywany czas wykonania w godzinach.
  estimatedHours: number
  stan: 'todo' | 'doing' | 'done'
  // Daty jako ISO string — po JSON.parse i tak wracają stringiem.
  createDate: string
  startDate: string | null
  endDate: string | null
  assigneeId: number | null
}

// Stan, daty i przypisaną osobę ustawia wyłącznie store — inaczej automatyka przejść
// z wytycznych byłaby do obejścia z poziomu formularza.
export type TaskFormData = Omit<
  Task,
  'id' | 'stan' | 'createDate' | 'startDate' | 'endDate' | 'assigneeId'
>
