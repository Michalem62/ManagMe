<script setup lang="ts">
import type { Project } from '@/types/Project'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  'delete-project': [projectId: number]
}>()
</script>
<template>
  <div>
    <h3 class="h5 mb-3">Projects list</h3>
    <div v-if="projects.length === 0" class="alert alert-info">No projects to show</div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @delete-project="emit('delete-project', $event)"
      />
    </div>
  </div>
</template>
