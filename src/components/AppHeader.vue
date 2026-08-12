<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import type { Project } from '@/types/Project'

const myUserStore = useUserStore()
const projectStore = useProjectStore()

defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  option: [id: number]
}>()

function handleChange(event: Event) {
  emit('option', Number((event.target as HTMLSelectElement).value))
}
</script>
<template>
  <div class="header-style">
    <div class="project-select">
      <label for="projectSelection">Active project:</label>
      <select
        :value="projectStore.activeProjectId"
        @change="handleChange"
        id="projectSelection"
      >
        <option :value="null" disabled>Choose your project</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">
          {{ project.name }}
        </option>
      </select>
    </div>
    <nav>
      <RouterLink to="/">Projects</RouterLink>
      <RouterLink to="/stories">Stories</RouterLink>
      <RouterLink to="/tasks">Tasks</RouterLink>
    </nav>
    <h3>User:</h3>
    <p>
      Name: {{ myUserStore.currentUser.userName }} Surname:
      {{ myUserStore.currentUser.userSurname }} ({{ myUserStore.currentUser.role }})
    </p>
  </div>
</template>
<style scoped>
.header-style {
  position: relative;
  height: auto;
  width: 100%;
  background-color: lightgray;
  text-align: center;
  align-content: center;
}

.project-select {
  position: absolute;
  top: 20px;
  left: 20px;
}

nav a {
  margin: 0 5px;
}
</style>
