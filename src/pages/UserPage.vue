<script setup lang="ts">
import type { APIResponse } from '@/types/responseJson'
import type { OtherUserData } from '@/types/user'
import { ref, type Ref } from 'vue'

const props = defineProps({
    username: String,
})

const user: Ref<OtherUserData | null> = ref(null)

async function getOtherUser() {
    try {
        let url = `http://localhost:8000/users/${props.username}`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error("something went wrong")
        }

        const responseJson: APIResponse = await response.json()
        user.value = responseJson.data
    } catch (error) {
        console.log(error)
    }
}

getOtherUser()

</script>
<template>
    <RouterLink to="/home">Back</RouterLink>
    <p>{{ user?.username }}</p>
    <p>{{ user?.created_at }}</p>
    <button class="border-2 cursor-pointer">Follow</button>
</template>