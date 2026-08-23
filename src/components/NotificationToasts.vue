<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import PriorityBadge from './PriorityBadge.vue'

const router = useRouter()
const notificationStore = useNotificationStore()

// Klasy .toast z Bootstrapa, ale cyklem życia steruje Vue — wpuszczenie tu JS biblioteki
// dałoby dwóch właścicieli tego samego DOM-u i duchy po zamkniętych toastach.
function openDetails(id: number) {
  notificationStore.dismissToast(id)
  router.push(`/notification-details/${id}`)
}
</script>
<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div v-for="toast in notificationStore.toasts" :key="toast.id" class="toast show" role="alert">
      <div class="toast-header">
        <PriorityBadge :priority="toast.priority" />
        <strong class="me-auto ms-2">{{ toast.title }}</strong>
        <button
          type="button"
          class="btn-close"
          aria-label="Zamknij"
          @click="notificationStore.dismissToast(toast.id)"
        ></button>
      </div>
      <button
        type="button"
        class="toast-body btn btn-link text-start text-decoration-none w-100"
        @click="openDetails(toast.id)"
      >
        {{ toast.message }}
      </button>
    </div>
  </div>
</template>
