<script setup lang="ts">
import { ref } from 'vue'
import GenerateApi from '@/api/GenerateApi'

const path = ref<string>('')

const scanFolder = async (): Promise<void> => {
    await GenerateApi.generate(path.value)
}
</script>

<template>
    <h2 class="label">Добавить книги из папки</h2>
    <div class="select-folder">
        <el-input v-model="path" style="width: 350px" />
        <el-button type="success" :disabled="!path" style="margin-left: 5px" @click="scanFolder"
            >Добавить</el-button
        >
    </div>
</template>

<style scoped>
.select-folder {
    display: flex;
    margin-top: 10px;
}
</style>
