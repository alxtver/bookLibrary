import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/MainView.vue'
import Settings from '@/views/Settings.vue'
import BookPage from '@/components/bookpage/BookPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: Main },
        { path: '/book/:id', name: 'bookPage', component: BookPage },
        { path: '/settings', name: 'settings', component: Settings }
    ]
})

export default router
