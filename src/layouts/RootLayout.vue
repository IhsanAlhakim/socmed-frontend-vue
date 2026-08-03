<script setup lang="ts">
import { signOut } from '@/api/users'
import Button from '@/components/Button.vue'
import { loggedInUserKey } from '@/config/injectionKeys'
import { unknownErrorMessage } from '@/errors/unknown-error'
import type { UserData } from '@/types/user'
import { Home } from '@lucide/vue'
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
        console.log(error)
        alert("signOut failed")
    }
}
</script>

<template>
    <div class="relative w-full grid grid-cols-[25%_50%_25%] bg-[#030712] text-white">
        <aside class="fixed w-[25%] h-dvh border-r">
            <div class="h-full flex flex-col py-5 pl-15 pr-10">
                <h1 class="text-4xl font-bold">Socmed</h1>
                <ul class="flex mt-5 text-2xl font-semibold items-center gap-5">
                    <Home :size="30"/>
                    <li>Home</li>
                </ul>
                <div class="mt-auto flex flex-col gap-5">
                    <p class="text-center text-lg">Hello, {{ userData.username }}</p>
                    <Button @click="signOutButtonHandler" class="bg-red-700 hover:bg-red-500 text-lg">Sign Out</Button>
                </div>
            </div>
        </aside>
        <!-- Div untuk mengisi posisi aside yang fixed -->
        <div></div> 
        <!-- Div untuk mengisi posisi aside yang fixed -->
        <main class="min-h-dvh">
            <RouterView />
        </main>
         <!-- Div untuk mengisi posisi aside yang fixed -->
        <div></div> 
        <!-- Div untuk mengisi posisi aside yang fixed -->
        <aside class="right-0 fixed w-[25%] h-dvh border-l"></aside>
    </div>
</template>