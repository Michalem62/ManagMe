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
  <main>
    <h1 class="h3 mb-4">Project details</h1>

    <p v-if="isLoading" class="text-body-secondary">Ładowanie…</p>
    <div v-else-if="!project" class="alert alert-warning">
      Nie znaleziono projektu o id {{ id }}.
    </div>

    <div v-else class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold">{{ project.name }}</span>
        <span class="badge text-bg-secondary">id: {{ project.id }}</span>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-3">Name</dt>
          <dd class="col-sm-9">{{ project.name }}</dd>

          <dt class="col-sm-3">Description</dt>
          <dd class="col-sm-9 mb-0">{{ project.description }}</dd>
        </dl>
      </div>
    </div>

    <RouterLink to="/" class="btn btn-outline-secondary">Back to project list</RouterLink>
  </main>
</template>
