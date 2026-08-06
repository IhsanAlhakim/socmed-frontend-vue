<script setup lang="ts">
import { createPostComment, getPostComments } from '@/api/comments';
import { likePost, unlikePost } from '@/api/post-likes';
import { getPostById } from '@/api/posts';
import Button from '@/components/Button.vue';
import CommentItem from '@/components/CommentItem.vue';
import { loggedInUserKey } from '@/config/injectionKeys';
import { HttpError, statusUnauthorized } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { Post } from '@/types/post';
import type { PostComment } from '@/types/postComment';
import { getPostCreatedDate } from '@/utils/date';
import { Heart, MessageCircle, MoveLeft } from '@lucide/vue';
import { inject, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const props = defineProps({
    postId: String,
})

let postIdInt = 0

if (props.postId) {
    postIdInt = parseInt(props.postId, 10)
}

const router = useRouter()

const loggedInUser = inject(loggedInUserKey)

const post: Ref<Post | null> = ref(null)
const comments: Ref<PostComment[]> = ref([])
const postLikes = ref(false)
const postLikeCount = ref(0)

const isLoading = ref(false)


async function getPostAndComments() {
    if (!props.postId) {
        return
    }

    try {
        const [getPostResponse, getPostCommentsResponse] = await Promise.all([getPostById(postIdInt), getPostComments(postIdInt)])

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
    if (!post.value) {
        toast("Something wrong happened, please try again later", {
            action: {
                label: "Close"
            }
        })
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
        if (error instanceof HttpError && error.statusCode === statusUnauthorized) {
            router.push("/signin")
        } else {
            console.log(error)
            toast("Something wrong happened, please try again later", {
                action: {
                    label: "Close"
                }
            })
        }
    }
}

const createCommentContent = ref("")

async function createComment() {
    if(!post.value) {
        return
    }

    try {
        const createCommentResponse = await createPostComment(post.value.id, createCommentContent.value)

        if (!createCommentResponse.ok) {
            throw createCommentResponse.error
        }

        toast("Comment created!", {
            action: {
                label: "Close"
            }
        })
        createCommentContent.value = ""
    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
    }
}



</script>
<template>
    <div class="flex items-center border-b gap-5 px-5 py-2">
        <button @click="router.back()" class="rounded-md p-1 hover:bg-white/25 transition-all">
            <MoveLeft />
        </button>
        <p class="text-xl">Post</p>
    </div>
    <section class="flex flex-col gap-3 p-5 border-b">
        <p @click.stop="router.push({ path: `/u/${post?.creator}` })"
            class="font-bold cursor-pointer hover:underline transition-all">{{
                post?.creator }}</p>
        <p>{{ post?.content }}</p>
        <p class="font-thin">{{ post ? getPostCreatedDate(post?.created_at) : "" }}</p>
    </section>
    <section class="flex gap-10 px-5 py-3 border-b">
        <div class="flex gap-1 p-0.5 rounded-md hover:bg-slate-50/20 transition-all text-lg">
            <button v-if="postLikes" class="cursor-pointer" @click.stop="likeHandler">
                <Heart :size="24" fill="#FF0000" />
            </button>
            <button v-else class="cursor-pointer" @click.stop="likeHandler">
                <Heart :size="24" />
            </button>
            <p>{{ postLikeCount }}</p>
        </div class="flex gap-1">
        <div class="flex gap-1 items-center text-lg">
            <MessageCircle :size="24" />
            <p>{{ post?.comment_count }}</p>
        </div>
    </section>
    <section class="border-b">
        <form @submit.prevent="createComment" class="w-full flex flex-col p-3 gap-2">
            <textarea v-model="createCommentContent" placeholder="Post your reply"
                class="p-2 focus:outline-none w-full min-h-20 resize-none field-sizing-content" />
            <Button type="submit" class="w-18.75 text-sm ml-auto"
                :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500 transition-all']">Reply</Button>
        </form>
    </section>
    <section>
        <CommentItem v-if="loggedInUser && postId"  v-for="comment in comments" :key="comment.id" :comment="comment" :logged-in-user-id="loggedInUser.id" :post-creator-id="postIdInt" />
    </section>
</template>