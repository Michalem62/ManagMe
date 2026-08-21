<script setup lang="ts">
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectList from '@/components/ProjectList.vue'
import type { ProjectFormData } from '@/types/Project'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

async function handleDeleteProject(id: number) {
  await projectStore.removeProject(id)
}

async function handleAddProject(projectData: ProjectFormData) {
  await projectStore.addProject(projectData)
}
</script>
<template>
  <main>
    <h1 class="h3 mb-4">Projects</h1>

    <div class="card mb-4">
      <div class="card-header">New project</div>
      <div class="card-body">
        <ProjectForm @submit="handleAddProject" />
      </div>
    </div>

    <ProjectList :projects="projectStore.projects" @delete-project="handleDeleteProject" />
  </main>
</template>
