<script setup lang="ts">
import { signUp, type NewUserFormData } from '@/api/users';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const newUser: Ref<NewUserFormData> = ref({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
})

const router = useRouter()

async function signUpFormHandler() {
    if (newUser.value.password !== newUser.value.confirmPassword) {
        alert("password does not match")
        return
    }

    try {
        const signUpResponse = await signUp({
            email: newUser.value.email,
            username: newUser.value.username,
            password: newUser.value.password
        })

        if (!signUpResponse.ok) {
            throw signUpResponse.error
        }

        alert("user created")

        router.push("/signin")

    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
    }
}

</script>

<template>
    <RouterLink to="/signin">Back</RouterLink>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUpFormHandler">
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
    <RouterLink to="/signin">Already have an account</RouterLink>
</template>