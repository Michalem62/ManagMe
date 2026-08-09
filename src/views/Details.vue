<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Project } from '@/types/Project'

const projectStore = useProjectStore()

const props = defineProps<{
  id: number
}>()

const project = ref<Project | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  project.value = await projectStore.getProjectById(props.id)
  isLoading.value = false
})
</script>
<template>
  <h1>Project details</h1>
  <p v-if="isLoading">Ładowanie…</p>
  <p v-else-if="!project">Nie znaleziono projektu o id {{ id }}.</p>
  <template v-else>
    <h2>Project id: {{ project.id }}</h2>
    <p><strong>Name:</strong> {{ project.name }}</p>
    <p><strong>Description:</strong> {{ project.description }}</p>
  </template>
  <RouterLink to="/" class="btn">Back to project list</RouterLink>
</template>
<style scoped>
.btn {
  width: 130px;
}
</style>
