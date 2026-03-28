<script setup lang="ts">
import ProjectForm from '@/components/ProjectForm.vue'
import { useRouter } from 'vue-router'
import { getProjectById, editProject } from '@/services/projectStorage'
import type { ProjectFormData, Project } from '@/types/Project'

const router = useRouter()
const props = defineProps<{
  id: number
}>()

const projectById = getProjectById(props.id)

function handleEditProject(projectData: ProjectFormData) {
  if (projectById) {
    const updatedProject: Project = {
      id: projectById.id,
      name: projectData.name,
      description: projectData.description,
    }
    editProject(updatedProject)
    router.push('/')
  }
}
</script>
<template>
  <h1>Edit projects</h1>
  <h2>Id produktu: {{ projectById?.id }}</h2>
  <p>
    <strong>Product name:</strong> {{ projectById?.name }} <strong>Product description:</strong>
    {{ projectById?.description }}
  </p>
  <ProjectForm to="/" @submit="handleEditProject" />
  <RouterLink to="/">Back to project list</RouterLink>
</template>
