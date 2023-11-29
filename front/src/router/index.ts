import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/MainVue.vue'
import Settings from '@/views/Settings.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: Main },
        { path: '/settings', name: 'settings', component: Settings }
    ]
})

export default router
