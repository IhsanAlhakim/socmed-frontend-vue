<script setup lang="ts">
import type { UserData } from '@/types/user';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

let userDataObjStr = localStorage.getItem("userObj")

let userDataObj

if (!userDataObjStr) {
    router.push("/")
} else {
    userDataObj = JSON.parse(userDataObjStr)
}

const userData: Ref<UserData> = ref(userDataObj)

</script>
<template>
    <aside>
        <p>Hello {{ userData.username }}</p>
    </aside>
    <main>Home</main>
</template>