<script setup lang="ts">
import { loggedInUserKey } from '@/config/injectionKeys'
import type { UserData } from '@/types/user'
import { provide, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let userDataObjStr = localStorage.getItem("userObj")

let userDataObj

if (!userDataObjStr) {
    router.push("/")
} else {
    userDataObj = JSON.parse(userDataObjStr)
}

const userData: Ref<UserData> = ref(userDataObj)

provide(loggedInUserKey, userDataObj)

async function signOut() {
    if (!confirm("are you sure you want to sign out?") === true) {
        return
    }

    try {
        const url = "http://localhost:8000/sessions"

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

        router.push("/signin")

    } catch (error) {
        console.log(error)
        alert("signout failed")
    }
}
</script>

<template>
    <aside>
        <p>Hello {{ userData.username }}</p>
        <button @click="signOut">Logout</button>
    </aside>
    <br>
    <main>
        <RouterView />
    </main>
</template>