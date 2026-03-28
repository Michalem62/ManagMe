import type { Project, ProjectFormData } from '@/types/Project'

const PROJECTS_KEY = 'projects'
export const NEXT_ID_KEY = 'projectNextId'

//pobiera listę wszystkich projektów i zwraca pustą tablicę jeśli ich nie ma
export function getProjects(): Project[] {
  const projects = localStorage.getItem(PROJECTS_KEY)

  if (!projects) return []

  return JSON.parse(projects) as Project[]
}

function saveProjects(project: Project[] | Project): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(project))
}

//szuka projektów po id i zwraca obiekt
export function getProjectById(projectId: number): Project {
  const project = getProjects()

  const findProject = project.find((project) => project.id == projectId)
  if (!findProject) 
    throw new Error("Can't find Project")

  return findProject
}

//szuka ostaniego id i go zwraca
function getNextProjectId(): number {
  const projects = getProjects()
  const savedNextId = Number(localStorage.getItem(NEXT_ID_KEY))

  const nextId = savedNextId || getMaxProjectId(projects) + 1

  localStorage.setItem(NEXT_ID_KEY, String(nextId + 1))

  return nextId
}

//function to find last id of the projects
function getMaxProjectId(projects: Project[]): number {
  if (!projects.length) 
    return 0

  return Math.max(...projects.map((project) => project.id))
}

export function editProject(updatedProject: Project): void {
  const projects = getProjects()

  const updatedProjects = projects.map((project) =>
    project.id === updatedProject.id ? updatedProject : project,
  )

  saveProjects(updatedProjects)
}

//function to add a project
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

//fucntion to delete existing project
export function deleteProject(projectId: number): void {
  const projects = getProjects().filter((project) => project.id !== projectId)

  saveProjects(projects)
}
