import { createRouter, createWebHistory } from 'vue-router'
import ProjectsView from '@/views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProjectsView,
    },
    {
      path: '/project-edit/:id',
      name: 'edit_view',
      component: () => import('@/views/EditView.vue'),
      props: (route) => ({
        id: Number(route.params.id),
      }),
    },
    {
      path: '/stories',
      name: 'stories_view',
      component: () => import('@/views/StoriesView.vue'),
    },
    {
      path: '/project-details/:id',
      name: 'details_view',
      component: () => import('@/views/Details.vue'),
      props: (route) => ({
        id: Number(route.params.id),
      }),
    },
    {
      path: '/tasks',
      name: 'tasks_view',
      component: () => import('@/views/TasksView.vue'),
    },
    {
      path: '/task-details/:id',
      name: 'task_details_view',
      component: () => import('@/views/TaskDetails.vue'),
      props: (route) => ({
        id: Number(route.params.id),
      }),
    },
  ],
})

export default router
