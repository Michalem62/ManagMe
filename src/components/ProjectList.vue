<script setup lang="ts">
import type { Project } from '@/types/Project'
import ProjectCard from './ProjectCard.vue'

//ProjectsView.vue musi przekazać tablice projektów. Tak właśnie działa props
defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  'delete-project': [projectId: number]
}>()
</script>
<template>
  <div class="container">
    <h3>Projects list</h3>
    <p v-if="projects.length === 0">No projects to show</p>
    <ul v-else>
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @delete-project="emit('delete-project', $event)"
      />
    </ul>
  </div>
</template>
<style scoped></style>
