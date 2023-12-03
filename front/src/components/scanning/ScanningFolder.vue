<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import GenerateApi from '@/api/GenerateApi'
import { io } from 'socket.io-client'

const path = ref<string>('')
const numberOfFiles = ref<number>(0)
const currentFile = ref<number>(0)
const loading = ref<boolean>(false)
const text = ref<string>('')
const textContainer = ref<HTMLElement | null>(null)

const socket = io('ws://localhost:3000')

socket.on('connect', (): void => {
    console.log('Websocket connected', socket.id)
})

socket.on('message', async (message: string): Promise<void> => {
    text.value += `\n${message}`
    await nextTick()
    if (textContainer.value) {
        const height = (textContainer.value as HTMLElement).scrollHeight
        textContainer.value.scrollTo({ top: height, behavior: 'smooth' })
    }
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

const clearState = (): void => {
    numberOfFiles.value = 0
    currentFile.value = 0
    text.value = ''
}

const scanFolder = async (): Promise<void> => {
    clearState()
    window.localStorage.setItem('bookDir', path.value)
    await GenerateApi.generate(path.value)
}

const percentage = computed(
    (): number => Math.round((currentFile.value / numberOfFiles.value) * 100) || 0
)
</script>

<template>
    <h2 class="label">Добавить книги из папки</h2>
    <div class="select-folder" :style="{ marginTop: text ? 0 : '30vh' }">
        <div>
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
    </div>
    <div style="height: 30px; margin-top: 10px">
        <el-progress
            v-if="loading"
            :text-inside="true"
            :stroke-width="26"
            :percentage="percentage"
        />
    </div>
    <pre ref="textContainer" class="text" v-if="text">{{ text }}</pre>
</template>

<style scoped>
.select-folder {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    transition: all 0.3s ease-out;
}
.text {
    padding: 10px;
    height: calc(100% - 170px);
    overflow: auto;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.3);
    background: black;
    color: darkgoldenrod;
}
</style>
