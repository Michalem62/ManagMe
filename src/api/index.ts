import type { Project } from '@/types/Project'
import type { Stories } from '@/types/Stories'
import type { Task } from '@/types/Task'
import { LocalStorageApi } from './LocalStorageApi'
import { StorageValue } from './StorageValue'

// Jedyne miejsce w aplikacji, które decyduje o tym, gdzie trafiają dane.
// Podmiana backendu = podmiana tych instancji.
export const projectApi = new LocalStorageApi<Project>('projects')
export const storyApi = new LocalStorageApi<Stories>('stories')
export const taskApi = new LocalStorageApi<Task>('tasks')
export const activeProjectStorage = new StorageValue<number>('activeProject')

export type { IApiClient } from './IApiClient'
export { LocalStorageApi } from './LocalStorageApi'
export { StorageValue } from './StorageValue'
