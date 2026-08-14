<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import StoryForm from '@/components/StoryForm.vue'
import StoryColumn from '@/components/StoryColumn.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useStoryStore } from '@/stores/storyStore'
import type { Stories, StoryFormData } from '@/types/Stories'

const projectStore = useProjectStore()
const storyStore = useStoryStore()

const editedStory = ref<Stories | null>(null)

onMounted(async () => {
  await storyStore.fetchStories()
})

// Wybór projektu przeniósł się do nagłówka, ale formularz nadal nie może zostać
// z historyjką z poprzedniego projektu.
watch(
  () => projectStore.activeProjectId,
  () => {
    editedStory.value = null
  },
)

async function handleSubmit(storyData: StoryFormData) {
  if (editedStory.value) {
    await storyStore.editStory({ ...editedStory.value, ...storyData })
    editedStory.value = null
  } else {
    await storyStore.addStory(storyData)
  }
}

async function handleDelete(id: number) {
  if (editedStory.value?.id === id) editedStory.value = null

  await storyStore.removeStory(id)
}

async function handleChangeState(id: number, stan: Stories['stan']) {
  await storyStore.changeState(id, stan)
}
</script>
<template>
  <main>
    <h1>Stories</h1>

    <p v-if="!projectStore.activeProject">Wybierz aktywny projekt, żeby zobaczyć historyjki.</p>

    <template v-else>
      <p>Project: {{ projectStore.activeProject.name }}</p>

      <StoryForm :story="editedStory" @submit="handleSubmit" @cancel="editedStory = null" />

      <div class="columns">
        <StoryColumn
          title="Todo"
          :stories="storyStore.todo"
          @edit="editedStory = $event"
          @delete-story="handleDelete"
          @change-state="handleChangeState"
        />
        <StoryColumn
          title="Doing"
          :stories="storyStore.doing"
          @edit="editedStory = $event"
          @delete-story="handleDelete"
          @change-state="handleChangeState"
        />
        <StoryColumn
          title="Done"
          :stories="storyStore.done"
          @edit="editedStory = $event"
          @delete-story="handleDelete"
          @change-state="handleChangeState"
        />
      </div>
    </template>

    <RouterLink to="/">Back to project list</RouterLink>
  </main>
</template>
<style scoped>
.columns {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
</style>
