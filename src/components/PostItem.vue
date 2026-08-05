<script setup lang="ts">
import { likePost, unlikePost } from '@/api/post-likes';
import { deletePost } from '@/api/posts';
import { loggedInUserKey } from '@/config/injectionKeys';
import { HttpError, statusUnauthorized } from '@/errors/http-error';
import type { Post } from '@/types/post';
import { Heart, MessageCircle } from '@lucide/vue';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import Button from './Button.vue';
import Dialog from './ui/dialog/Dialog.vue';
import DialogClose from './ui/dialog/DialogClose.vue';
import DialogContent from './ui/dialog/DialogContent.vue';
import DialogDescription from './ui/dialog/DialogDescription.vue';
import DialogFooter from './ui/dialog/DialogFooter.vue';
import DialogHeader from './ui/dialog/DialogHeader.vue';
import DialogTitle from './ui/dialog/DialogTitle.vue';
import DialogTrigger from './ui/dialog/DialogTrigger.vue';

interface Props {
    post: Post
}
const props = defineProps<Props>()

const postLikes = ref(props.post.liked)
const postLikeCount = ref(props.post.like_count)
const router = useRouter()
const loggedInUser = inject(loggedInUserKey)
const isLoading = ref(false)
const isDeletePostDialogOpen = ref(false)

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

async function deletePostHandler() {
    if (props.post.user_id !== loggedInUser?.id) {
        toast("You cannot delete this post", {
            action: {
                label: "Close"
            }
        })
        return
    }

    try {
        isLoading.value = true
        const deletePostResponse = await deletePost(props.post.id)

        if (!deletePostResponse.ok) {
            throw deletePostResponse.error
        }

        toast("Post deleted!", {
            action: {
                label: "Close"
            }
        })
        isDeletePostDialogOpen.value = false
    } catch (error) {
        if (error instanceof HttpError && error.statusCode === statusUnauthorized) {
            router.push("/signin")
        } else {
            console.log(error)
            toast("Failed to delete post, please try again later", {
                action: {
                    label: "Close"
                }
            })
        }
    } finally {
        isLoading.value = false
    }
}

</script>
<template>
    <Dialog v-model:open="isDeletePostDialogOpen">
        <div class="flex flex-col gap-5 border-b p-5 cursor-pointer hover:bg-[#091536] transition-all"
            @click="router.push({ path: `/p/${post.id}` })">
            <div class="flex justify-between items-center">
                <p @click.stop="router.push({ path: `/u/${post.creator}` })" class="hover:underline transition-all">{{
                    post.creator }}</p>
                <DialogTrigger as-child>
                    <Button v-if="loggedInUser && loggedInUser.id === post.user_id"
                        @click.stop="isDeletePostDialogOpen = true" class="cursor-pointer text-sm"
                        :class="[isLoading ? 'bg-gray-700' : 'bg-red-700 hover:bg-red-500 transition-all']">Delete</Button>
                </DialogTrigger>
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
        <DialogContent class="bg-[#030712] text-white">
            <DialogHeader>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this post?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter class="text-sm">
                <DialogClose as-child>
                    <Button class="bg-red-700 hover:bg-red-500">
                        Cancel
                    </Button>
                </DialogClose>
                <Button @click="deletePostHandler" :is-disabled="isLoading"
                    :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500']">
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>