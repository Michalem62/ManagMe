import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectFormData } from '@/types/Project'
import { projectApi, activeProjectStorage } from '@/api'
import { useStoryStore } from './storyStore'
import { useNotificationStore } from './notificationStore'
import { useUserStore } from './userStore'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const activeProjectId = ref<number | null>(null)

  const activeProject = computed(
    () => projects.value.find((project) => project.id === activeProjectId.value) ?? null,
  )

  async function fetchProjects(): Promise<void> {
    projects.value = await projectApi.getAll()
  }

  async function getProjectById(id: number): Promise<Project | null> {
    return projectApi.getById(id)
  }

  async function addProject(projectData: ProjectFormData): Promise<void> {
    await projectApi.create(projectData)
    await fetchProjects()

    // Wymaganie mówi „otrzymuje każdy admin", więc lecimy po wszystkich adminach —
    // dziś to jedna osoba, ale pętla nie kłamie o intencji.
    const notificationStore = useNotificationStore()
    const admins = useUserStore().users.filter((user) => user.role === 'admin')

    for (const admin of admins) {
      await notificationStore.send({
        title: 'Nowy projekt',
        message: `Utworzono projekt „${projectData.name}".`,
        priority: 'high',
        recipientId: admin.id,
      })
    }
  }

  async function editProject(project: Project): Promise<void> {
    await projectApi.update(project)
    await fetchProjects()
  }

  async function removeProject(id: number): Promise<void> {
    // storyStore woływany dopiero tutaj, a nie w setupie — inaczej import krążyłby w kółko
    await useStoryStore().removeStoriesOfProject(id)
    await projectApi.delete(id)

    // bez tego w storage zostałoby id nieistniejącego projektu
    if (activeProjectId.value === id) await clearActiveProject()

    await fetchProjects()
  }

  async function setActiveProject(id: number): Promise<void> {
    activeProjectId.value = id
    await activeProjectStorage.set(id)
  }

  async function loadActiveProject(): Promise<void> {
    activeProjectId.value = await activeProjectStorage.get()
  }

  async function clearActiveProject(): Promise<void> {
    activeProjectId.value = null
    await activeProjectStorage.clear()
  }

  return {
    projects,
    activeProjectId,
    activeProject,
    fetchProjects,
    getProjectById,
    addProject,
    editProject,
    removeProject,
    setActiveProject,
    loadActiveProject,
    clearActiveProject,
  }
})
