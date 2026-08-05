<script setup lang="ts">
import { followUser, unfollowUser } from '@/api/follows'
import { getPostsByUsername } from '@/api/posts'
import { getUserByUsername } from '@/api/users'
import Button from '@/components/Button.vue'
import PostItem from '@/components/PostItem.vue'
import { loggedInUserKey } from '@/config/injectionKeys'
import { HttpError, statusInternalServerError, statusNotFound, statusUnauthorized } from '@/errors/http-error'
import { unknownErrorMessage } from '@/errors/unknown-error'
import type { Post } from '@/types/post'
import type { UserData } from '@/types/user'
import { getJoinedDate } from '@/utils/date'
import { Calendar, MoveLeft } from '@lucide/vue'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const props = defineProps({
    username: String,
})

const user: Ref<UserData | null> = ref(null)
const posts: Ref<Post[] | null> = ref(null)
const followed: Ref<boolean> = ref(false)
const loggedInUser = inject(loggedInUserKey)

const router = useRouter()

async function getUserDataAndPost() {
    if (!props.username) {
        toast("User account unavailable", {
            action: {
                label: "Close"
            }
        })
        return
    }

    try {
        const [getUserResponse, getPostsResponse] = await Promise.all([getUserByUsername(props.username), getPostsByUsername(props.username)])

        if (!getUserResponse.ok) {
            throw getUserResponse.error
        }

        if (!getPostsResponse.ok) {
            throw getPostsResponse.error
        }

        if (!getUserResponse.response || !getPostsResponse.response) {
            throw new Error("empty response")
        }

        const userData: UserData = getUserResponse.response.data
        user.value = userData
        followed.value = userData.followed
        posts.value = getPostsResponse.response.data

    } catch (error) {
        if (error instanceof HttpError && error.statusCode !== statusInternalServerError) {
            if (error.statusCode === statusUnauthorized) {
                router.push("/signin")
                return
            }
            if (error.statusCode === statusNotFound) {
                toast("User not found", {
                    action: {
                        label: "Close"
                    }
                })
                return
            }
            console.log(error)
            toast("Failed to load user page, please try again later", {
                action: {
                    label: "Close"
                }
            })
        } else {
            console.log(error)
            toast("Failed to load user page, please try again later", {
                action: {
                    label: "Close"
                }
            })
        }
    }
}

getUserDataAndPost()

async function followButtonHandler() {
    if (!user.value) {
        return
    }

    try {
        if (followed.value == false) {
            const followResponse = await followUser(user.value.id)

            if (!followResponse.ok) {
                throw followResponse.error
            }
            followed.value = true
        } else {
            const unfollowResponse = await unfollowUser(user.value.id)

            if (!unfollowResponse.ok) {
                throw unfollowResponse.error
            }
            followed.value = false
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

</script>
<template>
    <div class="flex items-center border-b gap-5 px-5 py-2">
        <button @click="router.back()" class="rounded-md p-1 hover:bg-white/25 transition-all">
            <MoveLeft />
        </button>
        <div>
            <p class="font-bold">{{ user?.username }}</p>
            <p>{{ posts?.length }} posts</p>
        </div>
    </div>
    <section class="flex flex-col gap-3 p-5 mb-5">
        <div class="flex gap-20 items-center">
            <p class="font-bold text-xl">{{ user?.username }}</p>
            <div v-if="user && loggedInUser && user.username != loggedInUser.username">
                <Button v-if="followed" class="cursor-pointer bg-white text-black hover:bg-gray-500 transition-all"
                    @click.stop="followButtonHandler">followed</Button>
                <Button v-else class="cursor-pointer hover:bg-white/25 transition-all"
                    @click.stop="followButtonHandler">follow</Button>
            </div>
        </div>
        <div class="flex gap-2 items-center">
            <Calendar :size="16" />
            <p>Joined {{ user ? getJoinedDate(user?.created_at) : "" }}</p>
        </div>
        <div class="flex gap-5">
            <p><span class="font-bold">{{ user?.following_count }}</span> following</p>
            <p><span class="font-bold">{{ user?.follower_count }}</span> followers</p>
        </div>
    </section>
    <section>
        <div class="border text-center p-3">
            Posts
        </div>
        <div>
            <PostItem v-for="post in posts" :key="post.id" :post="post" />
        </div>
    </section>
</template>