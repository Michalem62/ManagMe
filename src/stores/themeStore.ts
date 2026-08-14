import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Theme } from '@/types/Theme'
import { themeStorage } from '@/api'

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('auto')
  const systemPrefersDark = ref(darkQuery.matches)

  // Bootstrap zna tylko dwa motywy, więc 'auto' musi się na coś rozwinąć
  const resolved = computed<'light' | 'dark'>(() =>
    theme.value === 'auto' ? (systemPrefersDark.value ? 'dark' : 'light') : theme.value,
  )

  // Jedyne miejsce, które dotyka DOM — reszta store'a operuje na stanie
  watch(resolved, (value) => document.documentElement.setAttribute('data-bs-theme', value), {
    immediate: true,
  })

  // Przestawienie motywu w systemie ma być widoczne od razu, dopóki siedzimy w 'auto'
  darkQuery.addEventListener('change', (event) => {
    systemPrefersDark.value = event.matches
  })

  async function init(): Promise<void> {
    theme.value = (await themeStorage.get()) ?? 'auto'
  }

  async function setTheme(value: Theme): Promise<void> {
    theme.value = value
    await themeStorage.set(value)
  }

  return { theme, resolved, init, setTheme }
})
