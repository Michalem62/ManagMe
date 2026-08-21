<script setup lang="ts">
import { computed } from 'vue'
import type { Stories } from '@/types/Stories'

const props = defineProps<{
  stan: Stories['stan']
}>()

const variant = computed(
  () =>
    ({
      todo: 'text-bg-secondary',
      doing: 'text-bg-primary',
      done: 'text-bg-success',
    })[props.stan],
)
</script>
<template>
  <span class="badge" :class="variant">{{ stan }}</span>
</template>
