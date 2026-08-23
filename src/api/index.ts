import type { Notification } from '@/types/Notification'
import type { Project } from '@/types/Project'
import type { Stories } from '@/types/Stories'
import type { Task } from '@/types/Task'
import type { Theme } from '@/types/Theme'
import { LocalStorageApi } from './LocalStorageApi'
import { StorageValue } from './StorageValue'

// Jedyne miejsce w aplikacji, które decyduje o tym, gdzie trafiają dane.
// Podmiana backendu = podmiana tych instancji.
export const projectApi = new LocalStorageApi<Project>('projects')
export const storyApi = new LocalStorageApi<Stories>('stories')
export const taskApi = new LocalStorageApi<Task>('tasks')
export const notificationApi = new LocalStorageApi<Notification>('notifications')
export const activeProjectStorage = new StorageValue<number>('activeProject')
export const themeStorage = new StorageValue<Theme>('theme')

export type { IApiClient } from './IApiClient'
export { LocalStorageApi } from './LocalStorageApi'
export { StorageValue } from './StorageValue'
