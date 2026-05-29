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

function createUser() {
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
            <input type="email" name="email" v-model="newUser.email">
        </div>
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" v-model="newUser.username">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="text" name="password" v-model="newUser.password">
        </div>
        <div>
            <label for="confirm_password">Confirm Password</label>
            <input type="text" name="confirm_password" v-model="newUser.password">
        </div>
    <button>Sign Up</button>
    </form>
</template>