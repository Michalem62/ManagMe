export interface Notification {
  id: number
  title: string
  message: string
  date: string
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  recipientId: number
}

export type NotificationDraft = Omit<Notification, 'id' | 'date' | 'isRead'>
