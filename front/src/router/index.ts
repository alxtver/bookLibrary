import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/MainVue.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    }
  ]
})

export default router
