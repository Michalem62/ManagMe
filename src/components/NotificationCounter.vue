<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
</script>
<template>
  <RouterLink
    to="/notifications"
    class="btn btn-sm btn-outline-secondary position-relative"
    title="Notifications"
  >
    Notifications
    <span
      v-if="notificationStore.unreadCount > 0"
      class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger"
    >
      {{ notificationStore.unreadCount }}
      <span class="visually-hidden">nieprzeczytanych powiadomień</span>
    </span>
  </RouterLink>
</template>
