<script setup lang="ts">
import { getProjectById } from '@/services/projectService'
import { getStories } from '@/services/storiesService'

const props = defineProps<{
  id: number
}>()

const getProject = getProjectById(props.id)
</script>
<template>
  <h1>Project details</h1>
  <h2>Project id: {{ getProject.id }}</h2>
  <br />
  <label>Add funcionality</label><br />
  <textarea></textarea><br />
  <input type="button" value="add funcionality" class="btn" /><br />
  <RouterLink to="/" class="btn">Back to project list</RouterLink>
</template>
<style src="./src/assets/main.css">
.btn {
  width: 130px;
}
</style>
