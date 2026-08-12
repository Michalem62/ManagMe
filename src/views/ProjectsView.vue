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
    <a>Actual chosen project: {{ projectStore.activeProject?.name ?? 'brak' }}</a>
    <div class="container">
      <div class="form-element">
        <h1>Projects</h1>
        <ProjectForm @submit="handleAddProject" />
      </div>
    </div>
    <div class="project-list">
      <ProjectList :projects="projectStore.projects" @delete-project="handleDeleteProject" />
    </div>
  </main>
</template>
<style scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 200px;
}

.form-element {
  border: 1px solid black;
  padding: 10px;
}
.project-list {
  display: flex;
  align-items: start;
  flex-direction: row;
}
</style>
