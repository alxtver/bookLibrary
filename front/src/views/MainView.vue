<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BooksApi from '../api/BooksApi'
import type { Book } from '../../../src/books/entities/book.entity'
import BookCard from '../components/bookcard/BookCard.vue'

const books = ref<Book[]>([])

onMounted((): void => {
    loadBooks()
})

const loadBooks = async (): Promise<void> => {
    books.value = await BooksApi.getAllBooks()
}
</script>

<template>
    <div style="height: 100%; overflow: auto">
        <div class="wrapper">
            <BookCard :book="book" v-for="book in books" :key="book.id" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
