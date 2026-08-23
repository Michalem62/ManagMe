export interface Notification {
  id: number
  title: string
  message: string
  // ISO string, jak Stories.createDate — po JSON.parse i tak wraca stringiem.
  date: string
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  recipientId: number
}

// To, co wypełnia miejsce wywołania. Datę, id i isRead dokłada store.
export type NotificationDraft = Omit<Notification, 'id' | 'date' | 'isRead'>
