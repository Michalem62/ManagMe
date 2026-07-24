import { defineStore } from 'pinia'
import type { Project } from '@/types/Project'
import { ref, computed } from 'vue'
import { getActiveProject, saveActiveProjectId } from '@/services/projectService'

export const useProjectStore = defineStore('activeProjects', () => {
  const projects = ref<Project[]>([])
  const activeProjectId = ref<number | null>(null)

  const activeProject = computed(() => {
    return projects.value.find((project) => project.id === activeProjectId.value) ?? null
  })

  function setActiveProject(id: number) {
    activeProjectId.value = id
    saveActiveProjectId(id)
  }

  function loadActiveProject() {
    activeProjectId.value = getActiveProject()
  }

  return {
    projects,
    activeProjectId,
    activeProject,
    setActiveProject,
    loadActiveProject,
  }
})
