<script setup lang="ts">
import { computed } from 'vue'
import type { Stories } from '@/types/Stories'

const props = defineProps<{
  priority: Stories['priority']
}>()

// Jedyne miejsce z mapowaniem priorytetu na kolor — inaczej rozjechałoby się
// po kartach historyjek, zadań i widoku szczegółów.
const variant = computed(
  () =>
    ({
      low: 'text-bg-secondary',
      medium: 'text-bg-warning',
      high: 'text-bg-danger',
    })[props.priority],
)
</script>
<template>
  <span class="badge" :class="variant">{{ priority }}</span>
</template>
