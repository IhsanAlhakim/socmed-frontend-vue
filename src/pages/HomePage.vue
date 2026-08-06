<script setup lang="ts">
import { createPost, getPost } from '@/api/posts';
import Button from '@/components/Button.vue';
import PostItem from '@/components/PostItem.vue';
import { HttpError, statusBadRequest, statusInternalServerError, statusUnauthorized } from '@/errors/http-error';
import type { Post } from '@/types/post';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const postContent: Ref<string> = ref("")
const isLoading = ref(false)
const router = useRouter()

async function createPostFormHandler() {
    try {
        isLoading.value = true
        const createPostResponse = await createPost(postContent.value)

        if (!createPostResponse.ok) {
            throw createPostResponse.error
        }

        toast("Post created!", {
                action: {
                    label: "Close"
                }
        })

        postContent.value = ""
    } catch (error) {
        if (error instanceof HttpError && error.statusCode !== statusInternalServerError) {
            if (error.statusCode === statusUnauthorized) {
                router.push("/signin")
                return
            }
            if (error.statusCode === statusBadRequest) {
                toast("Post content cannot be empty", {
                    action: {
                        label: "Close"
                    }
                })
                return
            }
            console.log(error)
            toast("Failed to create comment, please try again later", {
                action: {
                    label: "Close"
                }
            })
        } else {
            console.log(error)
            toast("Failed to create comment, please try again later", {
                action: {
                    label: "Close"
                }
            })
        }
    } finally {
        isLoading.value = false
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
        if (error instanceof HttpError && error.statusCode === statusUnauthorized) {
            router.push("/signin")
        } else {
            console.log(error)
            toast("Failed to load posts, please try again later", {
                action: {
                    label: "Close"
                }
            })
        }
    }
}

getPostsHandler()

</script>
<template>
    <section class="text-center py-3 border-b">
        <p class="font-bold">Discover</p>
    </section>
    <section>
        <form @submit.prevent="createPostFormHandler" class="border-b w-full flex flex-col p-3 gap-2">
            <textarea v-model="postContent" placeholder="Start a post"
                class="p-2 focus:outline-none w-full min-h-20 resize-none field-sizing-content" />
            <Button type="submit" class="w-18.75 text-sm ml-auto"
                :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500 transition-all']">Post</Button>
        </form>
    </section>
    <section>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </section>
</template>