import type { User } from '@/types/User'

const admin: User = { id: 1, userName: 'Michal', userSurname: 'Slowiak', role: 'admin' }

export const mockUsers: User[] = [
  admin,
  { id: 2, userName: 'Anna', userSurname: 'Kowalska', role: 'developer' },
  { id: 3, userName: 'Piotr', userSurname: 'Nowak', role: 'devops' },
  { id: 4, userName: 'Katarzyna', userSurname: 'Wisniewska', role: 'developer' },
]

export const loggedUser = admin
