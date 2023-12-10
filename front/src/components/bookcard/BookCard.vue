<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import ImageApi from '@/api/ImageApi'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import router from '@/router'
import type { Book } from "@/components/bookcard/types";

const props = defineProps<{ book: Book }>()
const { book } = toRefs(props)
const image = ref<string | null>(null)

onMounted(async (): Promise<void> => {
    const images = await ImageApi.getImagesByBookId(book.value.id)
    if (images.length) {
        image.value = images[0].data
    }
})

const onSelectBook = (): void => {
    router.push(`/book/${book.value.id}`)
}
</script>

<template>
    <el-card
        class="card"
        :body-style="{
            padding: '0px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }"
        @click="onSelectBook"
    >
        <div style="height: 100%">
            <img v-if="image" :src="image" class="image" :alt="book.title" />
            <el-image v-else style="width: 100%; height: 100%">
                <template #error>
                    <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                    </div>
                </template>
            </el-image>
        </div>
        <div style="padding: 14px; display: flex; flex-direction: column">
            <span class="title">{{ book.title }}</span>
            <div style="margin-top: 5px; display: flex; flex-direction: column">
                <span class="authors" v-for="author in book.authors" :key="author.id">{{
                    `${author.lastName} ${author.firstName}`
                }}</span>
            </div>
            <div class="bottom">
                <time class="time"
                    >{{
                        new Date(book.realiseDate).toLocaleString([], {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    }}
                </time>
            </div>
        </div>
    </el-card>
</template>

<style scoped lang="scss">
.card {
    width: 280px;
    margin: 10px;
    cursor: pointer;
    &:hover {
        transform: scale(1.03);
    }
}
.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: flex-end;
}

.button {
    padding: 0;
    min-height: auto;
}

.image {
    width: 100%;
    display: block;
}
.title {
    font-weight: bold;
    color: #606060;
}
.authors {
    color: #606060;
    font-size: 14px;
}
.image-slot {
    font-size: 200px;
    color: lightgray;
    display: flex;
    justify-content: center;
    align-self: center;
    width: 100%;
    height: 100%;
    align-items: center;
}
</style>
