<script setup lang="ts">
import { ref } from 'vue'
import BookCard from '../components/bookcard/BookCard.vue'
import { type Author, type Book } from '@/components/bookcard/types'
import SearchField from '@/components/searchfield/SearchField.vue'
import GlobalSearchApi from '@/api/GlobalSearchApi'

const books = ref<Book[]>([])
const authors = ref<Author[]>([])

const onSearch = async (pattern: string): Promise<void> => {
    if (pattern.length < 3) {
        books.value = []
        authors.value = []
        return
    }
    const data = await GlobalSearchApi.search(pattern)
    books.value = data.books
    authors.value = data.authors
}
</script>

<template>
    <div style="display: flex; width: 100%; justify-content: center">
        <search-field style="width: 50%" @changePattern="onSearch" />
    </div>
    <div v-if="books.length" style="height: 100%; overflow: auto">
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
