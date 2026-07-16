<script setup lang="ts">
import { createPost, getPost } from '@/api/posts';
import PostItem from '@/components/home/PostItem.vue';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { Post } from '@/types/post';
import { ref, type Ref } from 'vue';

const postContent: Ref<string> = ref("")

async function createPostFormHandler() {
    try {
        const createPostResponse = await createPost(postContent.value)

        if (!createPostResponse.ok) {
            throw createPostResponse.error
        }

        alert("post created")

        postContent.value = ""
    } catch (error) {
       if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        } 
    }
}

const posts: Ref<Post[] | null> = ref(null)

async function getPostsHandler() {
    try {
        const getPostsResponse = await getPost()

        if (!getPostsResponse.ok) {
            throw getPostsResponse.error
        }

        posts.value = getPostsResponse.response?.data

    } catch (error) {
       if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        } 
    }
}

getPostsHandler()

</script>
<template>
    <section>
        <form @submit.prevent="createPostFormHandler">
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