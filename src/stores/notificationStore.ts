import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationDraft } from '@/types/Notification'
import { notificationApi } from '@/api'
import { useUserStore } from './userStore'

// Po tylu milisekundach toast znika sam. Krzyżyk i kliknięcie w treść zdejmują go wcześniej.
const TOAST_TIMEOUT = 6000

export const useNotificationStore = defineStore('notifications', () => {
  const userStore = useUserStore()

  const notifications = ref<Notification[]>([])
  // Toasty trzymamy osobno od listy: to samo powiadomienie żyje w obu, ale znika z rogu
  // ekranu bez ruszania flagi isRead.
  const toasts = ref<Notification[]>([])

  // Licznik i oba widoki pokazują wyłącznie skrzynkę zalogowanego, najnowsze na górze.
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

    // Okno dialogowe tylko dla medium i high (wymaganie) i tylko dla własnej skrzynki —
    // inaczej admin oglądałby toasty o cudzych zadaniach.
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
