import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationDraft } from '@/types/Notification'
import { notificationApi } from '@/api'
import { useUserStore } from './userStore'

const TOAST_TIMEOUT = 6000

export const useNotificationStore = defineStore('notifications', () => {
  const userStore = useUserStore()

  const notifications = ref<Notification[]>([])
  const toasts = ref<Notification[]>([])

  const myNotifications = computed(() =>
    notifications.value
      .filter((item) => item.recipientId === userStore.currentUser.id)
      .sort((a, b) => b.date.localeCompare(a.date)),
  )

  const unread = computed(() => myNotifications.value.filter((item) => !item.isRead))

  const unreadCount = computed(() => unread.value.length)

  async function fetchNotifications(): Promise<void> {
    notifications.value = await notificationApi.getAll()
  }

  function getNotificationById(id: number): Notification | null {
    return notifications.value.find((item) => item.id === id) ?? null
  }

  async function send(draft: NotificationDraft): Promise<void> {
    const created = await notificationApi.create({
      ...draft,
      date: new Date().toISOString(),
      isRead: false,
    })

    await fetchNotifications()

    if (draft.priority === 'low') return
    if (draft.recipientId !== userStore.currentUser.id) return

    toasts.value.push(created)
    setTimeout(() => dismissToast(created.id), TOAST_TIMEOUT)
  }

  async function markAsRead(id: number): Promise<void> {
    const notification = getNotificationById(id)

    if (!notification || notification.isRead) return

    await notificationApi.update({ ...notification, isRead: true })
    await fetchNotifications()
  }

  function dismissToast(id: number): void {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  return {
    notifications,
    toasts,
    myNotifications,
    unread,
    unreadCount,
    fetchNotifications,
    getNotificationById,
    send,
    markAsRead,
    dismissToast,
  }
})
