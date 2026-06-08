<script setup lang="ts">
import type { Post } from '@/types/post';
import { ref } from 'vue';

interface Props {
    post: Post
}

const props = defineProps<Props>()

const postLikes = ref(props.post.liked)

async function likePost() {
    try {
        postLikes.value = true
        
        const url = `http://localhost:8000/posts/${props.post.id}/likes`
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
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

async function unLikePost() {
    try {
        postLikes.value = false
        
        const url = `http://localhost:8000/posts/${props.post.id}/likes`
        
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json"
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

</script>
<template>
    <div class="mb-4">
        <p>{{ post.creator }}</p>
        <p>{{ post.content }}</p>
        <div>
            <button v-if="postLikes" class="border-2 cursor-pointer" @click="unLikePost">liked</button>
            <button v-else class="border-2 cursor-pointer" @click="likePost">like</button>
        </div>
    </div>
</template>