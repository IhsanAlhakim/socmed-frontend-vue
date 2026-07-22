<script setup lang="ts">
import { getPostComments } from '@/api/comments';
import { likePost, unlikePost } from '@/api/post-likes';
import { getPostById } from '@/api/posts';
import { loggedInUserKey } from '@/config/injectionKeys';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { Post } from '@/types/post';
import type { PostComment } from '@/types/postComment';
import { inject, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    postId: Number,
})

const router = useRouter()

const loggedInUser = inject(loggedInUserKey)

const post: Ref<Post | null> = ref(null)
const comments: Ref<PostComment[]> = ref([])
const postLikes = ref(false)
const postLikeCount = ref(0)


async function getPostAndComments() {
    if (!props.postId) {
        return 
    }
    
    try {
        const [getPostResponse, getPostCommentsResponse] = await Promise.all([getPostById(props.postId), getPostComments(props.postId)])

        if (!getPostResponse.ok) {
            throw getPostResponse.error
        }

        if (!getPostCommentsResponse.ok) {
            throw getPostCommentsResponse.error
        }

        if (!getPostResponse.response || !getPostCommentsResponse.response) {
            throw new Error("empty response")
        }

        const PostData: Post = getPostResponse.response.data
        post.value = PostData
        comments.value = getPostCommentsResponse.response.data
        postLikes.value = PostData.liked
        postLikeCount.value = PostData.like_count
    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
    }
}

getPostAndComments()

async function likeHandler() {
    if(!post.value) {
        alert("post no available")
        return
    }

    try {
        if (postLikes.value == false) {

            const likePostResponse = await likePost(post.value.id)

            if (!likePostResponse.ok) {
                throw likePostResponse.error
            }
            postLikes.value = true
            postLikeCount.value = postLikeCount.value + 1

        } else {
            const unlikePostResponse = await unlikePost(post.value.id)

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

const createCommentContent = ref("")
async function createComment() {
    try {
        let url = `http://localhost:8000/posts/${post.value?.id}/comments`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                "content": createCommentContent.value
            })
        })

        if (!response.ok) {
            throw new Error("something went wrong")
        }
        alert("comment created")
        createCommentContent.value = ""
    } catch (error) {
        console.log(error)
        alert("create post failed")
    }
}

async function deleteCommentHandler(commentId: number) {
    if (!confirm("do you want to delete this comment")) {
        return
    }
    try {
        const url = `http://localhost:8000/comments/${commentId}`

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
        alert("comment deleted")

    } catch (error) {
        console.log(error)
        alert("failed to delete comment")
    }
}



</script>
<template>
    <RouterLink to="/home">Back</RouterLink>
    <div class="mb-4">
        <p @click="router.push(`/u/${post?.creator}`)" class="cursor-pointer">{{ post?.creator }}</p>
        <p>{{ post?.created_at }}</p>
        <p>{{ post?.content }}</p>
        <div class="flex">
            <button v-if="postLikes" class="border-2 cursor-pointer" @click="likeHandler">liked</button>
            <button v-else class="border-2 cursor-pointer" @click="likeHandler">like</button>
            <p>: {{ postLikeCount }}</p>
        </div>
        <p>comment : {{ post?.comment_count }}</p>
    </div>
    <br>
    <form @submit.prevent="createComment">
        <div>
            <textarea rows="5" cols="30" v-model="createCommentContent" class="border-2"></textarea>
        </div>
        <button class="border-2 cursor-pointer">Reply</button>
    </form>
    <br>
    <section>
        <p>Comments</p>
        <br>
        <div v-for="comment in comments" :key="comment.id" class="mb-4">
            <button v-if="loggedInUser && post && (loggedInUser.id === comment.user_id || loggedInUser.id === post.user_id)"
                class="border-2 cursor-pointer" @click="deleteCommentHandler(comment.id)">Delete</button>
            <p>{{ comment.username }}</p>
            <p>{{ comment.content }}</p>
        </div>
    </section>
</template>