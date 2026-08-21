<script setup lang="ts">
import type { Project, ProjectFormData } from '@/types/Project'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Brak propa project = tryb dodawania, prop project = formularz startuje wypełniony
const props = defineProps<{
  project?: Project | null
}>()

//utworzyłem obiekt z danymi bez id (przez zdefiniowanie ProjectFormData w typach), żebym mógł pobrać dane z fomrularza
const data = ref<ProjectFormData>({
  name: '',
  description: '',
})

// projekt w EditView dojeżdża asynchronicznie, więc formularz musi go dogonić
watch(
  () => props.project,
  (project) => {
    data.value = project
      ? { name: project.name, description: project.description }
      : { name: '', description: '' }
  },
  { immediate: true },
)

//zdefiniowałem event do dodawania projektu do listy, który przyjmuje obiekt bez id
const emit = defineEmits<{
  submit: [project: ProjectFormData]
}>()
//tutaj obsłużyłem dodawanie projektu poprzez stworzenie funkcji, która przyjmuje typ bez id i wykorzystuje zdefiniowany wcześniej emit do wysłania eventu
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
