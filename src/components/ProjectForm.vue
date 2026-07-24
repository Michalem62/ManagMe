<script setup lang="ts">
import type { ProjectFormData } from '@/types/Project'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

//utworzyłem obiekt z danymi bez id (przez zdefiniowanie ProjectFormData w typach), żebym mógł pobrać dane z fomrularza
const data = ref<ProjectFormData>({
  name: '',
  description: '',
})

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
  <div>
    <form @submit.prevent="handleSubmit">
      <label for="name">Name</label><br />
      <input v-model="data.name" type="text" id="name" required /><br />
      <label for="description">Description</label><br />
      <textarea v-model="data.description" id="description" required></textarea><br />
      <input v-if="route.name == 'edit_view'" type="submit" value="edit" />
      <input v-else type="submit" value="add" />
    </form>
  </div>
</template>
<style scoped></style>
