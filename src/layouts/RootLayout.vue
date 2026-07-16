<script setup lang="ts">
import { signOut } from '@/api/users'
import { loggedInUserKey } from '@/config/injectionKeys'
import { unknownErrorMessage } from '@/errors/unknown-error'
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

async function signOutButtonHandler() {
    if (!confirm("are you sure you want to sign out?")) {
        return
    }

    try {
        const signOutResponse = await signOut()

        if (!signOutResponse.ok) {
            throw signOutResponse.error
        }

        router.push("/signin")
    } catch (error) {
        alert("signOut failed")
    }
}
</script>

<template>
    <aside>
        <p>Hello {{ userData.username }}</p>
        <button @click="signOutButtonHandler">Logout</button>
    </aside>
    <br>
    <main>
        <RouterView />
    </main>
</template>