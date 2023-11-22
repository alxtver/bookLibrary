<script setup lang="ts">
import GenerateApi from '../../api/GenerateApi'

const onClick = async (): Promise<void> => {
    await GenerateApi.generate()
}
</script>

<template>
    <el-button type="primary" @click="onClick">Кнопка</el-button>
</template>
