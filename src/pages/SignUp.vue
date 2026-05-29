<script setup lang="ts">
import { ref, type Ref } from 'vue';

interface User {
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
}

const newUser: Ref<User> = ref({
    email : "",
    username: "",
    password: "",
    confirmPassword: "",
})

async function createUser() {
    if (newUser.value.password !== newUser.value.confirmPassword) {
        alert("password does not match")
        return
    }

    let requestBody = {
        email: newUser.value.email,
        username: newUser.value.username,
        password: newUser.value.password
    }

    let url = "http://localhost:8000/users"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        alert("create user failed")
        return
    }

    alert("create user successful")

    newUser.value = {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    }
}

</script>

<template>
    <h2>Sign Up</h2>
    <form @submit.prevent="createUser">
        <div>
            <label for="email">Email</label>
            <input type="email" required name="email" v-model="newUser.email">
        </div>
        <div>
            <label for="username">Username</label>
            <input type="text" required name="username" v-model="newUser.username">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" required name="password" v-model="newUser.password">
        </div>
        <div>
            <label for="confirm_password">Confirm Password</label>
            <input type="password" required name="confirm_password" v-model="newUser.confirmPassword">
        </div>
    <button>Sign Up</button>
    </form>
</template>