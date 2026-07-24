<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import { ref } from 'vue'
import type { Project } from '@/types/Project'

const myUserStore = useUserStore()
const projectStore = useProjectStore()
const projectId = ref<number | null>(projectStore.activeProjectId)

const props = defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  option: [id: number]
}>()
</script>
<template>
  <div class="header-style">
    <div class="project-select">
      <label for="projectSelection">Active project:</label>
      <select v-model="projectId" @change="emit('option', Number(projectId))" id="projectSelection">
        <option :value="null" disabled>Choose your project</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">
          {{ project.name }}
        </option>
      </select>
    </div>
    <h3>User:</h3>
    <p>Name: {{ myUserStore.user.userName }} Surname: {{ myUserStore.user.userSurname }}</p>
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
</style>
