<script setup lang="ts">
import type { Post } from '@/types/post';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
interface Props {
    post: Post
}
const props = defineProps<Props>()

const postLikes = ref(props.post.liked)
const postLikeCount = ref(props.post.like_count)

const router = useRouter()

async function likeHandler() {
    if (postLikes.value == false) {
        try {
            postLikes.value = true
            postLikeCount.value = postLikeCount.value + 1
            

            const url = `http://localhost:8000/posts/${props.post.id}/likes`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("something went wrong")
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            postLikes.value = false
            postLikeCount.value = postLikeCount.value - 1
            
            const url = `http://localhost:8000/posts/${props.post.id}/likes`

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

}

</script>
<template>
        <div class="mb-4 cursor-pointer" @click="router.push({ path: `/p/${post.id}` })">
            <p @click.stop="router.push({path: `/u/${post.creator}`})">{{ post.creator }}</p> 
            <p>{{ post.content }}</p>
            <div class="flex">
                <button v-if="postLikes" class="border-2 cursor-pointer" @click.stop="likeHandler">liked</button>
                <button v-else class="border-2 cursor-pointer" @click.stop="likeHandler">like</button>
                <p>: {{ postLikeCount }}</p>
            </div>
            <p>comment : {{ post.comment_count }}</p>
        </div>
</template>