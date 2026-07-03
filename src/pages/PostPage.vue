<script setup lang="ts">
import type { Post } from '@/types/post';
import type { PostComment } from '@/types/postComment';
import type { APIResponse } from '@/types/responseJson';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    postId: String,
})

const router = useRouter()

const post: Ref<Post | null> = ref(null)
const comments: Ref<PostComment[]> = ref([])
const postLikes = ref(false)

async function getPostAndComments() {
    try {
        let getPostUrl = `http://localhost:8000/posts/${props.postId}`
        let getPostCommentsUrl = `http://localhost:8000/posts/${props.postId}/comments`

        const getPostFetch = fetch(getPostUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        const getPostCommentsFetch = fetch(getPostCommentsUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        const [getPostResponse, getPostCommentsResponse] = await Promise.all([getPostFetch, getPostCommentsFetch]) 

        if (!getPostResponse.ok || !getPostCommentsResponse.ok) {
            throw new Error("something went wrong")
        }

        const postResponseJson: APIResponse = await getPostResponse.json()
        const commentsResponseJson: APIResponse = await getPostCommentsResponse.json()
        const PostData: Post = postResponseJson.data

        post.value = PostData
        comments.value = commentsResponseJson.data
        postLikes.value = PostData.liked
    } catch (error) {
        console.log(error)
    }
}

getPostAndComments()

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
            <p>{{ comment.username }}</p>
            <p>{{ comment.content }}</p>
        </div>
    </section>
</template>