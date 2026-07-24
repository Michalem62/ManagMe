<script setup lang="ts">
import type { Project } from '@/types/Project'
//tutaj poprosiłem rodzica(ProjectList) aby podał mi dane do pól z interfejsu(typu) Project
defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  'delete-project': [projectId: number]
}>()
</script>
<template>
  <li class="list-card">
    <strong>Project name: </strong>{{ project.name }}
    <p>Description: <br />{{ project.description }}</p>
    <RouterLink :to="{ name: 'edit_view', params: { id: project.id } }" class="btn"
      >Edit</RouterLink
    >
    <input type="button" @click="emit('delete-project', project.id)" class="btn" value="Delete"></input>
    <RouterLink :to="{ name: 'details_view', params: { id: project.id } }" class="btn"
      >Details</RouterLink
    >
  </li>
</template>
<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: grey;
  border: 1px solid black;
  width: 60px;
  height: 45px;
  font-size: 15px;
  text-decoration: none;
  font-family: 'Times New Roman', Times, serif;
  color: black;
}

.btn:hover {
  background-color: lightgray;
  cursor: pointer;
}
.list-card {
  text-decoration: none;
}
</style>
