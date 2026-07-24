<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectList from '@/components/ProjectList.vue'
import Header from '@/components/Header.vue'
import type { ProjectFormData } from '@/types/Project'
import {
  addProject,
  deleteProject,
  refreshProjectsList,
  refreshList,
} from '@/services/projectService'
import { useStoryStore } from '@/stores/storyStore'
import { useProjectStore } from '@/stores/projectStore'

const storiesStore = useStoryStore()
const projectStore = useProjectStore()

onMounted(() => {
  refreshProjectsList()
})

function handleDeleteProject(id: number) {
  deleteProject(id)
  refreshProjectsList()
}

function handleAddProject(projectData: ProjectFormData) {
  addProject(projectData)
  refreshProjectsList()
}

function handleActiveProject(id: number) {
  projectStore.setActiveProject(id)
  projectStore.loadActiveProject()
}

// function handleAddStory(){
//   storiesStore.addStory()
// }
</script>
<template>
  <main>
    <Header :projects="refreshList" @option="handleActiveProject" />
    <a>Actual chosen project id: {{ projectStore.activeProjectId }}</a>
    <div class="container">
      <div class="form-element">
        <h1>Projects</h1>
        <ProjectForm @submit="handleAddProject" />
      </div>
    </div>
    <div class="project-list">
      <ProjectList :projects="refreshList" @delete-project="handleDeleteProject" />
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
