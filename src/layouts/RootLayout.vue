<script setup lang="ts">
import { signOut } from '@/api/users'
import Button from '@/components/Button.vue'
import ShadButton from '@/components/ui/button/ShadButton.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import { loggedInUserKey } from '@/config/injectionKeys'
import type { UserData } from '@/types/user'
import { Home } from '@lucide/vue'
import { provide, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

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
    try {
        isLoading.value = true
        const signOutResponse = await signOut()

        if (!signOutResponse.ok) {
            throw signOutResponse.error
        }

        router.push("/signin")
    } catch (error) {
        console.log(error)
        alert("signOut failed")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <Dialog>
        <div class="relative w-full grid grid-cols-[25%_50%_25%] bg-[#030712] text-white">
            <aside class="fixed w-[25%] h-dvh border-r">
                <div class="h-full flex flex-col py-5 pl-15 pr-10">
                    <h1 class="text-4xl font-bold">Socmed</h1>
                    <ul class="flex mt-5 text-2xl font-semibold items-center gap-5">
                        <Home :size="30" />
                        <li>Home</li>
                    </ul>
                    <div class="mt-auto flex flex-col gap-5 items-center">
                        <p class="text-center text-lg">Hello, {{ userData.username }}</p>
                        <DialogTrigger as-child>
                            <Button class="w-40 bg-red-700 hover:bg-red-500 text-lg">Sign
                                Out</Button>
                        </DialogTrigger>
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
        <DialogContent class="bg-[#030712] text-white">
            <DialogHeader>
                <DialogTitle>Sign out</DialogTitle>
                <DialogDescription>
                    Are you sure you want to sign out?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter class="text-sm">
                <DialogClose as-child>
                <Button class="bg-red-700 hover:bg-red-500">
                    Cancel
                </Button>
                </DialogClose>
                <Button @click="signOutButtonHandler" :is-disabled="isLoading" :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500']">
                Sign Out
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>