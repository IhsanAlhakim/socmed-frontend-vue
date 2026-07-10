<script setup lang="ts">
import PostItem from '@/components/home/PostItem.vue'
import { loggedInUserKey } from '@/config/injectionKeys'
import type { Post } from '@/types/post'
import type { APIResponse } from '@/types/responseJson'
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
    try {
        const usersDataApiUrl = `http://localhost:8000/users/${props.username}`
        const postsDataApiUrl = `http://localhost:8000/users/${props.username}/posts`

        const usersFetch = fetch(usersDataApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        const postsFetch = fetch(postsDataApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        const [usersFetchResponse, postsFetchResponse] = await Promise.all([usersFetch, postsFetch])


        if (!usersFetchResponse.ok || !postsFetchResponse) {
            throw new Error("something went wrong")
        }

        const usersResponseJson: APIResponse = await usersFetchResponse.json()
        const postsResponseJson: APIResponse = await postsFetchResponse.json()
        const userData: UserData = usersResponseJson.data
        user.value = userData
        followed.value = userData.followed
        posts.value = postsResponseJson.data
    } catch (error) {
        console.log(error)
    }
}

getUserDataAndPost()

async function followHandler() {
    let requestBody = {
        followed_id: user.value?.id
    }

    if (followed.value == false) {
        try {
            followed.value = true

            const url = `http://localhost:8000/follow`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                throw new Error("something went wrong")
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            followed.value = false

            const url = `http://localhost:8000/follow`

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                throw new Error("something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

}

</script>
<template>
    <section>
        <RouterLink to="/home">Back</RouterLink>
        <p>{{ user?.username }}</p>
        <p>{{ user?.created_at }}</p>
        <div v-if="user && loggedInUser && user.username != loggedInUser.username">
            <button v-if="followed" class="border-2 cursor-pointer" @click.stop="followHandler">followed</button>
            <button v-else class="border-2 cursor-pointer" @click.stop="followHandler">follow</button>
        </div>
    </section>
    <br>
    <section>
        <p>Posts</p>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </section>
</template>