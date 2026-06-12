<script setup lang="ts">
import type { Post } from '@/types/post';
import type { APIResponse } from '@/types/responseJson';
import { ref, type Ref } from 'vue';

const props = defineProps({
    postId: String,
})

console.log(props.postId)

const post: Ref<Post | null> = ref(null)

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
        post.value = responseJson.data
    } catch (error) {
        console.log(error)
    }
}

getPost()
</script>
<template>
    <RouterLink to="/home">Back</RouterLink>
    <div class="mb-4">
        <p>{{ post?.creator }}</p>
        <p>{{ post?.created_at }}</p>
        <p>{{ post?.content }}</p>
    </div>
</template>