<script setup lang="ts">
import { followUser, unfollowUser } from '@/api/follows'
import { getPostsByUsername } from '@/api/posts'
import { getUserByUsername } from '@/api/users'
import PostItem from '@/components/PostItem.vue'
import { loggedInUserKey } from '@/config/injectionKeys'
import { HttpError } from '@/errors/http-error'
import { unknownErrorMessage } from '@/errors/unknown-error'
import type { Post } from '@/types/post'
import type { UserData } from '@/types/user'
import { inject, ref, type Ref } from 'vue'

const props = defineProps({
    username: String,
})

const user: Ref<UserData | null> = ref(null)
const posts: Ref<Post[] | null> = ref(null)
const followed: Ref<boolean> = ref(false)

const loggedInUser = inject(loggedInUserKey)


async function getUserDataAndPost() {
    if (!props.username) {
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
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
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
    <section>
        <RouterLink to="/home">Back</RouterLink>
        <p>{{ user?.username }}</p>
        <p>Following: {{ user?.following_count }}</p>
        <p>Follower: {{ user?.follower_count }}</p>
        <p>{{ user?.created_at }}</p>
        <div v-if="user && loggedInUser && user.username != loggedInUser.username">
            <button v-if="followed" class="border-2 cursor-pointer" @click.stop="followButtonHandler">followed</button>
            <button v-else class="border-2 cursor-pointer" @click.stop="followButtonHandler">follow</button>
        </div>
    </section>
    <br>
    <section>
        <p>Posts</p>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </section>
</template>