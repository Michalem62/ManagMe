<script setup lang="ts">
import type { Project } from '@/types/Project'
//tutaj poprosiłem rodzica(ProjectList) aby podał mi dane do pól z interfejsu(typu) Project
defineProps<{
  projects: Project
}>()

const emit = defineEmits<{
  'delete-project': [projectId: number]
}>()
</script>
<template>
  <li>
    <strong>{{ projects.id }}. {{ projects.name }}</strong>
    <p>{{ projects.description }}</p>
    <RouterLink :to="{ name: 'edit_view', params: { id: projects.id } }">Edit </RouterLink>
    <button type="button" @click="emit('delete-project', projects.id)">Delete</button>
  </li>
</template>
