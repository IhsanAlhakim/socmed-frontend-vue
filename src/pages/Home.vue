<script setup lang="ts">
import PostItem from '@/components/home/PostItem.vue';
import type { Post } from '@/types/post';
import type { APIResponse } from '@/types/responseJson';
import { ref, type Ref } from 'vue';

const postContent: Ref<string> = ref("")

interface CreatePostRequestBody {
    content: string
}

async function createPost() {
    let requestBody: CreatePostRequestBody = {
        content: postContent.value
    }

    try {
        let url = "http://localhost:8000/posts"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new Error("something went wrong")
        }
        alert("post created")
        postContent.value = ""
    } catch (error) {
        console.log(error)
        alert("create post failed")
    }
}

const posts: Ref<Post[] | null> = ref(null)

async function getPosts() {
    try {
        let url = "http://localhost:8000/posts"

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
        posts.value = responseJson.data
    } catch (error) {
        console.log(error)
    }
}

getPosts()

</script>
<template>
    <section>
        <form @submit.prevent="createPost">
            <div>
                <textarea rows="5" cols="30" v-model="postContent" class="border-2"></textarea>
            </div>
            <button class="border-2 cursor-pointer">Post</button>
        </form>
    </section>
    <section>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </section>
</template>