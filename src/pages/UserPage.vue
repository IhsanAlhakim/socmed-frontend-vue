<script setup lang="ts">
import PostItem from '@/components/home/PostItem.vue'
import type { Post } from '@/types/post'
import type { APIResponse } from '@/types/responseJson'
import type { UserData } from '@/types/user'
import { ref, type Ref } from 'vue'

const props = defineProps({
    username: String,
})

const user: Ref<UserData | null> = ref(null)
const posts: Ref<Post[] | null> = ref(null)

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
                "Content-Type":"application/json"
            },
            credentials: "include",
        })

        const [usersFetchResponse, postsFetchResponse] = await Promise.all([usersFetch, postsFetch])


        if (!usersFetchResponse.ok || !postsFetchResponse) {
            throw new Error("something went wrong")
        }

        const usersResponseJson: APIResponse = await usersFetchResponse.json()
        const postsResponseJson: APIResponse = await postsFetchResponse.json()
        user.value = usersResponseJson.data
        posts.value = postsResponseJson.data
    } catch (error) {
        console.log(error)
    }
}

getUserDataAndPost()

</script>
<template>
    <section>
        <RouterLink to="/home">Back</RouterLink>
        <p>{{ user?.username }}</p>
        <p>{{ user?.created_at }}</p>
        <button class="border-2 cursor-pointer">Follow</button>
    </section>
    <br>
    <section>
        <p>Posts</p>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </section>
</template>