import type { UserData } from '@/types/User'
import { ref } from 'vue'

const userStorage = ref<UserData[]>([])

function addUser(user: UserData) {
  const newUser: UserData = {
    userName: user.userName,
    userSurname: user.userSurname,
  }

  userStorage.value.push(newUser)

  localStorage.setItem('user', JSON.stringify(newUser))
}
