<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import NotificationToasts from '@/components/NotificationToasts.vue'
</script>
<template>
  <AppHeader />
  <div class="container pb-4">
    <RouterView />
  </div>
  <NotificationToasts />
</template>
