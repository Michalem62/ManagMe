<script setup lang="ts">
import type { Project, ProjectFormData } from '@/types/Project'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{
  project?: Project | null
}>()

const data = ref<ProjectFormData>({
  name: '',
  description: '',
})

watch(
  () => props.project,
  (project) => {
    data.value = project
      ? { name: project.name, description: project.description }
      : { name: '', description: '' }
  },
  { immediate: true },
)

const emit = defineEmits<{
  submit: [project: ProjectFormData]
}>()
function handleSubmit() {
  emit('submit', data.value)
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label" for="name">Name</label>
      <input v-model="data.name" type="text" id="name" class="form-control" required />
    </div>

    <div class="mb-3">
      <label class="form-label" for="description">Description</label>
      <textarea
        v-model="data.description"
        id="description"
        class="form-control"
        rows="3"
        required
      ></textarea>
    </div>

    <button type="submit" class="btn btn-primary">
      {{ route.name == 'edit_view' ? 'Save' : 'Add' }}
    </button>
  </form>
</template>
