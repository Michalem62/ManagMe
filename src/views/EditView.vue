<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectForm from '@/components/ProjectForm.vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import type { ProjectFormData, Project } from '@/types/Project'

const router = useRouter()
const projectStore = useProjectStore()

const props = defineProps<{
  id: number
}>()

const project = ref<Project | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  project.value = await projectStore.getProjectById(props.id)
  isLoading.value = false
})

async function handleEditProject(projectData: ProjectFormData) {
  if (!project.value) return

  const updatedProject: Project = {
    id: project.value.id,
    name: projectData.name,
    description: projectData.description,
  }

  await projectStore.editProject(updatedProject)
  router.push('/')
}
</script>
<template>
  <main>
    <h1>Edit projects</h1>
    <p v-if="isLoading">Ładowanie…</p>
    <p v-else-if="!project">Nie znaleziono projektu o id {{ id }}.</p>
    <template v-else>
      <h2>Project id: {{ project.id }}</h2>
      <p>
        <strong>Product name:</strong> {{ project.name }} <strong>Product description:</strong>
        {{ project.description }}
      </p>
      <ProjectForm :project="project" @submit="handleEditProject" />
    </template>
    <RouterLink to="/">Back to project list</RouterLink>
  </main>
</template>
