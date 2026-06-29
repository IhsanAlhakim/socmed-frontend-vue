<script setup lang="ts">
import type { Post } from '@/types/post';
import type { APIResponse } from '@/types/responseJson';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    postId: String,
})

const router = useRouter()

const post: Ref<Post | null> = ref(null)
const postLikes = ref(false)

async function getPost() {
    try {
        let url = `http://localhost:8000/posts/${props.postId}`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error("something went wrong")
        }

        const responseJson: APIResponse = await response.json()
        const PostData: Post = responseJson.data

        post.value = PostData
        postLikes.value = PostData.liked
    } catch (error) {
        console.log(error)
    }
}

getPost()

async function likeHandler() {
    if (postLikes.value == false) {
        try {
            postLikes.value = true

            const url = `http://localhost:8000/posts/${post.value?.id}/likes`

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

            const url = `http://localhost:8000/posts/${post.value?.id}/likes`

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
    <RouterLink to="/home">Back</RouterLink>
    <div class="mb-4">
        <p @click="router.push(`/u/${post?.creator}`)" class="cursor-pointer">{{ post?.creator }}</p>
        <p>{{ post?.created_at }}</p>
        <p>{{ post?.content }}</p>
        <div>
            <button v-if="postLikes" class="border-2 cursor-pointer" @click="likeHandler">liked</button>
            <button v-else class="border-2 cursor-pointer" @click="likeHandler">like</button>
        </div>
    </div>
</template>