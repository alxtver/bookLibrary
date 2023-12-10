<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const emit = defineEmits<{
    changePattern: [pattern: string]
}>()

const pattern = ref<string>('')

const onChange = (value: string): void => {
    emit('changePattern', value)
}
</script>

<template>
    <el-input
        v-model="pattern"
        class="w-50 m-2"
        size="large"
        placeholder="Поиск"
        :prefix-icon="Search"
        @input="onChange"
    />
</template>

<style scoped lang="scss"></style>
