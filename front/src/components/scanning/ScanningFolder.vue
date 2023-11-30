<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GenerateApi from '@/api/GenerateApi'
import { io } from 'socket.io-client'

const path = ref<string>('')
const numberOfFiles = ref<number>(0)
const currentFile = ref<number>(0)
const loading = ref<boolean>(false)

const socket = io('ws://localhost:3000')

socket.on('connect', (): void => {
    console.log('Websocket connected', socket.id)
})

socket.on('message', (message: string): void => {
    console.log(message)
})

socket.on('progress', (data: { count: number; current: number }): void => {
    numberOfFiles.value = data.count
    currentFile.value = data.current
    console.log(data)
})

socket.on('startScanning', (): void => {
    loading.value = true
})

socket.on('endScanning', (): void => {
    loading.value = false
})

socket.on('disconnect', (): void => {
    console.log('Websocket disconnect', socket.id)
})

onMounted((): void => {
    const bookDir = window.localStorage.getItem('bookDir')
    if (bookDir) {
        path.value = bookDir
    }
})

const scanFolder = async (): Promise<void> => {
    numberOfFiles.value = 0
    currentFile.value = 0
    window.localStorage.setItem('bookDir', path.value)
    await GenerateApi.generate(path.value)
}

const percentage = computed((): number =>
    Math.round((currentFile.value / numberOfFiles.value) * 100)
)
</script>

<template>
    <h2 class="label">Добавить книги из папки</h2>
    <div class="select-folder">
        <el-input v-model="path" style="width: 350px" />
        <el-button
            type="success"
            :disabled="!path"
            :loading="loading"
            style="margin-left: 5px"
            @click="scanFolder"
        >
            Добавить
        </el-button>
    </div>
    <el-progress
        v-if="numberOfFiles"
        :text-inside="true"
        :stroke-width="26"
        :percentage="percentage"
    />
</template>

<style scoped>
.select-folder {
    display: flex;
    margin-top: 10px;
}
</style>
