<script setup lang="ts">
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

const menuItems = [
    { index: '1', route: '/', name: 'Книги', icon: IconMenu },
    { index: '2', route: '/settings', name: 'Настройки', icon: Setting }
]
const defaultActive = ref<string>('1')

onMounted((): void => {
    const path = window.location.pathname
    const activeMenu = menuItems.find((item) => item.route === path)
    if (activeMenu) {
        defaultActive.value = activeMenu.index
    }
})
</script>

<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu"
        :default-active="defaultActive"
        text-color="#fff"
        :router="true"
    >
        <el-menu-item
            v-for="item in menuItems"
            :index="item.index"
            :route="item.route"
            :key="item.index"
        >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
        </el-menu-item>
    </el-menu>
</template>

<style scoped>
.el-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 6px 0 #000;
}
</style>
