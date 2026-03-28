<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectList from '@/components/ProjectList.vue'
import type { Project, ProjectFormData } from '@/types/Project'
import { getProjects, addProject, deleteProject } from '@/services/projectStorage'

const projectsList = ref<Project[]>(getProjects())

onMounted(() => {
  projectsList.value = getProjects()
})

function handleDeleteProject(id: number) {
  deleteProject(id)
  projectsList.value = getProjects()
}
function handleAddProject(projectData: ProjectFormData) {
  addProject(projectData)
  projectsList.value = getProjects()
}
</script>
<template>
  <main>
    <h1>Projekty</h1>
    <ProjectForm @submit="handleAddProject" />
    <ProjectList :projects="projectsList" @delete-project="handleDeleteProject" />
  </main>
</template>
