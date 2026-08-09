export type UserRole = 'admin' | 'devops' | 'developer'

export interface User {
  id: number
  userName: string
  userSurname: string
  role: UserRole
}

export type UserData = Omit<User, 'id'>
