<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import PriorityBadge from '@/components/PriorityBadge.vue'

const notificationStore = useNotificationStore()

const props = defineProps<{
  id: number
}>()

const isLoading = ref(true)

onMounted(async () => {
  await notificationStore.fetchNotifications()
  await notificationStore.markAsRead(props.id)
  isLoading.value = false
})

const notification = computed(() => notificationStore.getNotificationById(props.id))
</script>
<template>
  <main>
    <h1 class="h3 mb-4">Notification</h1>

    <p v-if="isLoading" class="text-body-secondary">Ładowanie…</p>
    <div v-else-if="!notification" class="alert alert-warning">
      Nie znaleziono powiadomienia o id {{ id }}.
    </div>

    <div v-else class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center gap-2">
        <span class="fw-semibold">{{ notification.title }}</span>
        <PriorityBadge :priority="notification.priority" />
      </div>
      <div class="card-body">
        <p>{{ notification.message }}</p>
        <p class="text-body-secondary small mb-0">
          {{ new Date(notification.date).toLocaleString() }}
        </p>
      </div>
    </div>

    <RouterLink to="/notifications" class="btn btn-outline-secondary">
      Back to notifications
    </RouterLink>
  </main>
</template>
