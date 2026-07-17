<script setup lang="ts">
import { likePost, unlikePost } from '@/api/post-likes';
import { loggedInUserKey } from '@/config/injectionKeys';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { Post } from '@/types/post';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
    post: Post
}
const props = defineProps<Props>()

const postLikes = ref(props.post.liked)
const postLikeCount = ref(props.post.like_count)
const router = useRouter()
const loggedInUser = inject(loggedInUserKey)


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
        const url = `http://localhost:8000/posts/${props.post.id}`

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
        alert("post deleted")

    } catch (error) {
        console.log(error)
    }
}

</script>
<template>
    <div class="mb-4 cursor-pointer" @click="router.push({ path: `/p/${post.id}` })">
        <button v-if="loggedInUser && loggedInUser.id === post.user_id" class="border-2 cursor-pointer bg-red-500"
            @click.stop="deletePostHandler">Delete Post</button>
        <p @click.stop="router.push({ path: `/u/${post.creator}` })">{{ post.creator }}</p>
        <p>{{ post.content }}</p>
        <div class="flex">
            <button v-if="postLikes" class="border-2 cursor-pointer" @click.stop="likeHandler">liked</button>
            <button v-else class="border-2 cursor-pointer" @click.stop="likeHandler">like</button>
            <p>: {{ postLikeCount }}</p>
        </div>
        <p>comment : {{ post.comment_count }}</p>
    </div>
</template>