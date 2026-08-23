<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import PriorityBadge from '@/components/PriorityBadge.vue'

const notificationStore = useNotificationStore()

const tab = ref<'unread' | 'all'>('unread')

onMounted(async () => {
  await notificationStore.fetchNotifications()
})

const visible = computed(() =>
  tab.value === 'unread' ? notificationStore.unread : notificationStore.myNotifications,
)

async function handleMarkAsRead(id: number) {
  await notificationStore.markAsRead(id)
}
</script>
<template>
  <main>
    <h1 class="h3 mb-4">Notifications</h1>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: tab === 'unread' }"
          @click="tab = 'unread'"
        >
          Nieprzeczytane
          <span class="badge text-bg-danger ms-1">{{ notificationStore.unreadCount }}</span>
        </button>
      </li>
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: tab === 'all' }"
          @click="tab = 'all'"
        >
          Wszystkie
          <span class="badge text-bg-secondary ms-1">
            {{ notificationStore.myNotifications.length }}
          </span>
        </button>
      </li>
    </ul>

    <div v-if="visible.length === 0" class="alert alert-info">
      {{ tab === 'unread' ? 'Brak nieprzeczytanych powiadomień.' : 'Brak powiadomień.' }}
    </div>

    <ul v-else class="list-group">
      <li
        v-for="notification in visible"
        :key="notification.id"
        class="list-group-item d-flex justify-content-between align-items-start gap-3"
      >
        <div>
          <div class="d-flex align-items-center gap-2">
            <PriorityBadge :priority="notification.priority" />
            <RouterLink
              :to="`/notification-details/${notification.id}`"
              class="text-decoration-none"
              :class="notification.isRead ? 'text-body-secondary' : 'fw-semibold'"
            >
              {{ notification.title }}
            </RouterLink>
          </div>
          <p class="mb-0 small">{{ notification.message }}</p>
          <p class="mb-0 text-body-secondary small">
            {{ new Date(notification.date).toLocaleString() }}
          </p>
        </div>

        <button
          v-if="!notification.isRead"
          type="button"
          class="btn btn-sm btn-outline-secondary flex-shrink-0"
          @click="handleMarkAsRead(notification.id)"
        >
          Oznacz jako przeczytane
        </button>
      </li>
    </ul>

    <RouterLink to="/" class="btn btn-outline-secondary mt-4">Back to project list</RouterLink>
  </main>
</template>
