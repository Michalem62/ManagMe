import { defineStore } from 'pinia'
import type { User } from '@/types/User'

export const useUserStore = defineStore('user', () => {
  const user: User = {
    id: 1,
    userName: 'Michal',
    userSurname: 'Slowiak',
  }

  return { user }
})
