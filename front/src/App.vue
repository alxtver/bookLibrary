<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainMenu from './components/menu/MainMenu.vue'
</script>

<template>
    <div class="container">
        <MainMenu class="main-menu" />
        <div class="main-view">
            <RouterView />
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    height: 100vh;
    .main-menu {
        width: 200px;
        height: 100%;
    }
    .main-view {
        margin: 10px;
    }
}
</style>
