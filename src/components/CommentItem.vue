<script setup lang="ts">
import { deletePostComment } from '@/api/comments';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import type { PostComment } from '@/types/postComment';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import Dialog from './ui/dialog/Dialog.vue';
import DialogTrigger from './ui/dialog/DialogTrigger.vue';
import Button from './Button.vue';
import DialogContent from './ui/dialog/DialogContent.vue';
import DialogHeader from './ui/dialog/DialogHeader.vue';
import DialogTitle from './ui/dialog/DialogTitle.vue';
import DialogDescription from './ui/dialog/DialogDescription.vue';
import DialogFooter from './ui/dialog/DialogFooter.vue';
import DialogClose from './ui/dialog/DialogClose.vue';


interface Props {
    comment: PostComment
    loggedInUserId: number
    postCreatorId: number
}
const props = defineProps<Props>()

const isDeleteCommentDialogOpen = ref(false)

const isLoading = ref(false)

const router = useRouter()


async function deleteCommentHandler(commentId: number) {
    try {
        const deleteCommentResponse = await deletePostComment(commentId)

        if (!deleteCommentResponse.ok) {
            throw deleteCommentResponse.error
        }
        toast("Comment deleted!", {
            action: {
                label: "Close"
            }
        })
        isDeleteCommentDialogOpen.value = false
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
    <Dialog v-model:open="isDeleteCommentDialogOpen">
        <div class="p-5 flex flex-col gap-3 border-b">
            <div class="flex justify-between items-center">
                <p @click.stop="router.push({ path: `/u/${comment.username}` })"
                    class="hover:underline transition-all font-bold cursor-pointer">{{
                        comment.username }}</p>
                <DialogTrigger as-child>
                    <Button v-if="(loggedInUserId === comment.user_id || loggedInUserId === postCreatorId)"
                        @click.stop="isDeleteCommentDialogOpen = true" class="cursor-pointer text-sm"
                        :class="[isLoading ? 'bg-gray-700' : 'bg-red-700 hover:bg-red-500 transition-all']">Delete</Button>
                </DialogTrigger>
            </div>
            <p>{{ comment.content }}</p>
        </div>
        <DialogContent class="bg-[#030712] text-white">
            <DialogHeader>
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this comment?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter class="text-sm">
                <DialogClose as-child>
                    <Button class="bg-red-700 hover:bg-red-500">
                        Cancel
                    </Button>
                </DialogClose>
                <Button @click="deleteCommentHandler(comment.id)" :is-disabled="isLoading"
                    :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500']">
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>