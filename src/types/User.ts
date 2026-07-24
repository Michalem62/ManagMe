export interface User {
  id: number
  userName: string
  userSurname: string
}

export type UserData = Omit<User, 'id'>
