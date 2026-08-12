<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import ThemeToggle from './ThemeToggle.vue'

const userStore = useUserStore()
const projectStore = useProjectStore()

// Nagłówek siedzi w app shellu, więc to on ładuje listę projektów i przywraca aktywny.
// Widoki nie powtarzają już tego u siebie.
onMounted(async () => {
  await projectStore.fetchProjects()
  await projectStore.loadActiveProject()
})

async function handleChange(event: Event) {
  await projectStore.setActiveProject(Number((event.target as HTMLSelectElement).value))
}
</script>
<template>
  <nav class="navbar bg-body-tertiary border-bottom mb-4">
    <div class="container-fluid gap-3">
      <span class="navbar-brand mb-0">ManageMe</span>

      <ul class="navbar-nav flex-row gap-2">
        <li class="nav-item">
          <RouterLink class="nav-link" exact-active-class="active" to="/">Projects</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" exact-active-class="active" to="/stories">
            Stories
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" exact-active-class="active" to="/tasks">Tasks</RouterLink>
        </li>
      </ul>

      <div class="d-flex align-items-center gap-2">
        <label class="form-label mb-0 text-body-secondary small" for="projectSelection">
          Active project
        </label>
        <select
          id="projectSelection"
          class="form-select form-select-sm w-auto"
          :value="projectStore.activeProjectId"
          @change="handleChange"
        >
          <option :value="null" disabled>Choose your project</option>
          <option v-for="project in projectStore.projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div class="d-flex align-items-center gap-2 ms-auto">
        <span class="small">{{ userStore.fullName(userStore.currentUser) }}</span>
        <span class="badge text-bg-secondary">{{ userStore.currentUser.role }}</span>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>
