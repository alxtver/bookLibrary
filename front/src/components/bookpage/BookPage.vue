<script setup lang="ts">
import { Book } from '@/components/bookcard/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BooksApi from '@/api/BooksApi'
import ImageApi from '@/api/ImageApi'

const book = ref<Book | null>(null)
const image = ref<string | null>(null)

const route = useRoute()

onMounted(async (): Promise<void> => {
    await loadBook()
    await loadImage()
})

/**
 * Загрузка книги
 */
const loadBook = async (): Promise<void> => {
    const bookId = route.params.id
    book.value = await BooksApi.getBookById(bookId as string)
}

/**
 * Загрузка изображения
 */
const loadImage = async (): Promise<void> => {
    if (!book.value) {
        return
    }
    const images = await ImageApi.getImagesByBookId(book.value.id)
    image.value = images.length ? images[0].data : null
}

const download = async (): Promise<void> => {
    await BooksApi.download(book.value!.id, book.value!.fileName)
}
</script>

<template>
    <div v-if="book" class="container">
        <img v-if="image" class="image" :src="image" :alt="book?.title" />
        <div class="book-info">
            <h1 class="label">{{ book.title }}</h1>

            <div class="genres">
                <span v-for="genre in book.genres" :key="genre.id">
                    {{ genre.name }}
                </span>
            </div>

            <div class="authors">
                <h2 v-for="author in book.authors" :key="author.id">
                    {{ `${author.firstName} ${author.lastName}` }}
                </h2>
            </div>
            <p class="annotation">{{ book.annotation }}</p>

            <div>
                <el-button type="info" @click="download">Скачать</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .book-info {
        display: flex;
        flex-direction: column;
        align-items: end;
        height: calc(100% - 40px);
        margin: 0 20px;
        .authors {
            color: #0339a8;
            display: flex;
            h2 + h2 {
                margin-left: 20px;
            }
        }
        .genres {
            color: #7e7e7e;
            font-weight: bold;
            font-size: smaller;
            margin-top: -20px;
            span + span {
                margin-left: 7px;
            }
        }
        .annotation {
            text-indent: 10px;
            font-size: 18px;
        }
    }
    .image {
        height: 100%;
        box-shadow: 0 2px 6px 0 #00000091;
    }
}
</style>
