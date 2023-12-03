<script setup lang="ts">
import type { Book } from '../../../../src/books/entities/book.entity'
import { toRefs } from 'vue'

const props = defineProps<{ book: Book }>()
const { book } = toRefs(props)
</script>

<template>
    <el-card class="card" :body-style="{ padding: '0px' }">
        <img :src="book.image" class="image" />
        <div style="padding: 14px">
            <span>{{ book.title }}</span>
            <div class="bottom">
                <time class="time">sdfsd </time>
                <el-button text class="button">Operating</el-button>
            </div>
        </div>
    </el-card>
</template>

<style scoped>
.card {
    width: 280px;
    margin: 10px;
}
.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.button {
    padding: 0;
    min-height: auto;
}

.image {
    width: 100%;
    display: block;
}
</style>
