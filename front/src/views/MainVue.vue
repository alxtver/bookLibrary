<script setup lang="ts">
import AuthorApi from '@/api/AuthorApi'

const onClick = async (): Promise<void> => {
    await AuthorApi.addAuthor({ name: 'Иван', fullName: 'Петров' })
}
</script>

<template>
    <el-button type="primary" @click="onClick">Кнопка</el-button>
</template>
