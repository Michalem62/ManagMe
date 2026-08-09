import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types/User'
import { loggedUser, mockUsers } from '@/data/mockUsers'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(mockUsers)
  const currentUser = ref<User>(loggedUser)

  // Zadania mogą wykonywać wyłącznie devops i developer — admin zarządza.
  const assignableUsers = computed(() =>
    users.value.filter((user) => user.role === 'devops' || user.role === 'developer'),
  )

  function getUserById(id: number): User | null {
    return users.value.find((user) => user.id === id) ?? null
  }

  function fullName(user: User): string {
    return `${user.userName} ${user.userSurname}`
  }

  return { users, currentUser, assignableUsers, getUserById, fullName }
})
