<script setup lang="ts">
import { likePost, unlikePost } from '@/api/post-likes';
import { deletePost } from '@/api/posts';
import { loggedInUserKey } from '@/config/injectionKeys';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { Post } from '@/types/post';
import { Heart, MessageCircle } from '@lucide/vue';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';

interface Props {
    post: Post
}
const props = defineProps<Props>()

const postLikes = ref(props.post.liked)
const postLikeCount = ref(props.post.like_count)
const router = useRouter()
const loggedInUser = inject(loggedInUserKey)
const isLoading = ref(false)

async function likeHandler() {
    try {
        if (postLikes.value == false) {

            const likePostResponse = await likePost(props.post.id)

            if (!likePostResponse.ok) {
                throw likePostResponse.error
            }
            postLikes.value = true
            postLikeCount.value = postLikeCount.value + 1

        } else {
            const unlikePostResponse = await unlikePost(props.post.id)

            if (!unlikePostResponse.ok) {
                throw unlikePostResponse.error
            }

            postLikes.value = false
            postLikeCount.value = postLikeCount.value - 1
        }
    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
    } 
}

async function deletePostHandler() {
    if (!confirm("delete this post?")) {
        return
    }

    if (props.post.user_id !== loggedInUser?.id) {
        alert("cannot delete this post")
        return
    }

    try {
        isLoading.value = true
        const deletePostResponse = await deletePost(props.post.id)

        if (!deletePostResponse.ok) {
            throw deletePostResponse.error
        }

        alert("post deleted")

    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
    } finally {
        isLoading.value = false
    }
}

</script>
<template>
    <div class="flex flex-col gap-5 border-b p-5 cursor-pointer hover:bg-[#091536] transition-all" @click="router.push({ path: `/p/${post.id}` })">
        <div class="flex justify-between items-center">
            <p @click.stop="router.push({ path: `/u/${post.creator}` })" class="hover:underline transition-all">{{ post.creator }}</p>
            <Button v-if="loggedInUser && loggedInUser.id === post.user_id" @click.stop="deletePostHandler" class="cursor-pointer text-sm" :class="[isLoading ? 'bg-gray-700' : 'bg-red-700 hover:bg-red-500 transition-all']">Delete</Button>
        </div>
        <div>
            <p>{{ post.content }}</p>
        </div>
        <div class="flex gap-10">
            <div class="flex gap-1 p-0.5 rounded-md hover:bg-slate-50/20 transition-all">
                <button v-if="postLikes" class="cursor-pointer" @click.stop="likeHandler">
                    <Heart :size="18" fill="#FF0000" />
                </button>
                <button v-else class="cursor-pointer" @click.stop="likeHandler">
                    <Heart :size="18" />
                </button>
                <p>{{ postLikeCount }}</p>
            </div class="flex gap-1">
            <div class="flex gap-1 items-center">
                <MessageCircle :size="18" />
                <p>{{ post.comment_count }}</p>
            </div>
        </div>
    </div>
</template>