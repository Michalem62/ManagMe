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
    <h1 class="h3 mb-4">Edit project</h1>

    <p v-if="isLoading" class="text-body-secondary">Ładowanie…</p>
    <div v-else-if="!project" class="alert alert-warning">
      Nie znaleziono projektu o id {{ id }}.
    </div>

    <template v-else>
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="fw-semibold">{{ project.name }}</span>
          <span class="badge text-bg-secondary">id: {{ project.id }}</span>
        </div>
        <div class="card-body">
          <p class="text-body-secondary">{{ project.description }}</p>
          <ProjectForm :project="project" @submit="handleEditProject" />
        </div>
      </div>
    </template>

    <RouterLink to="/" class="btn btn-outline-secondary">Back to project list</RouterLink>
  </main>
</template>
