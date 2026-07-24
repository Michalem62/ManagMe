import type { Project, ProjectFormData } from '@/types/Project'
import { ref } from 'vue'

const PROJECTS_KEY = 'projects'
const ACTIVE_PROJECT_KEY = 'activeProject'
export const NEXT_ID_KEY = 'projectNextId'
export const refreshList = ref<Project[]>(getProjects())

//pobiera listę wszystkich obiektów tablicy jako string z localStorage i zwraca pustą tablicę jeśli ich nie ma a jak są projekty to pobiera stringa obiektów z localStorage
// i zwraca obiekty tablicy typu Project
export function getProjects(): Project[] {
  const projects = localStorage.getItem(PROJECTS_KEY)

  if (!projects) return []

  return JSON.parse(projects) as Project[]
}

//odświeża listę projektów
export function refreshProjectsList(): void {
  refreshList.value = getProjects()
}

//zapisuje tablice obiektów tablicy w localStorage
function saveProjects(project: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(project))
}

//szuka obiektu projektów po id i zwraca dany obiekt z tablicy
export function getProjectById(projectId: number): Project {
  const project = getProjects()

  const findProject = project.find((project) => project.id == projectId)
  if (!findProject) throw new Error("Can't find Project")

  return findProject
}

//zwraca największe id projektu i dodaje jeden aby zwrócić największe możliwe id bez powtórki jako numer
function getNextProjectId(): number {
  const projects = getProjects()
  const savedNextId = Number(localStorage.getItem(NEXT_ID_KEY))

  const nextId = savedNextId || getMaxProjectId(projects) + 1

  localStorage.setItem(NEXT_ID_KEY, String(nextId + 1))

  return nextId
}

//zwraca największe aktualne id projektu
function getMaxProjectId(projects: Project[]): number {
  if (!projects.length) return 0

  return Math.max(...projects.map((project) => project.id))
}

//funckja map przechodzi po tablicy i zmienia elementy tylko projektu którego id równa się podanemu w parametrze id projektu i nadpisuje ten projekt
export function editProject(updatedProject: Project): void {
  const projects = getProjects().map((project) =>
    project.id === updatedProject.id ? updatedProject : project,
  )

  saveProjects(projects)
}

//funkcja która pobiera tablicę elementów, dodaje element i pcha go do tablicy projektów po czym zapisuje wszystko w localStorage
export function addProject(projectData: ProjectFormData): void {
  const projects = getProjects()

  const newProject: Project = {
    id: getNextProjectId(),
    name: projectData.name,
    description: projectData.description,
  }

  projects.push(newProject)
  saveProjects(projects)
}

//funkcja która pobiera i zwraca nową tablicę z elementami, które spełniły warunek
export function deleteProject(projectId: number): void {
  const projects = getProjects().filter((project) => project.id !== projectId)

  saveProjects(projects)
}

//funkcja która zapisuje aktualnie wybrany projekt do localStorage
export function saveActiveProjectId(id: number): void {
  localStorage.setItem(ACTIVE_PROJECT_KEY, JSON.stringify(id))
}

//funckja która pobiera aktualnie wybrany projekt z localStorage
export function getActiveProject(): number {
  const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY)

  return JSON.parse(String(savedId))
}
