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
  <h3>Lista produktów</h3>
  <p v-if="projects.length === 0">Brak produktów</p>
  <ul v-else>
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :projects="project"
      @delete-project="emit('delete-project', $event)"
    />
  </ul>
</template>
