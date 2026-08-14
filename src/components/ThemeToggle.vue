<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
import type { Theme } from '@/types/Theme'

const themeStore = useThemeStore()

const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]
</script>
<template>
  <div class="btn-group btn-group-sm" role="group" aria-label="Theme">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="btn btn-outline-secondary"
      :class="{ active: themeStore.theme === option.value }"
      :aria-pressed="themeStore.theme === option.value"
      @click="themeStore.setTheme(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
