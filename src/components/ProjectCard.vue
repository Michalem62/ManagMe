<script setup lang="ts">
import type { Project } from '@/types/Project'
defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  'delete-project': [projectId: number]
}>()
</script>
<template>
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ project.name }}</h5>
        <p class="card-text text-body-secondary">{{ project.description }}</p>
      </div>
      <div class="card-footer d-flex gap-2">
        <RouterLink
          :to="{ name: 'edit_view', params: { id: project.id } }"
          class="btn btn-sm btn-outline-primary"
        >
          Edit
        </RouterLink>
        <RouterLink
          :to="{ name: 'details_view', params: { id: project.id } }"
          class="btn btn-sm btn-outline-secondary"
        >
          Details
        </RouterLink>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger ms-auto"
          @click="emit('delete-project', project.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
