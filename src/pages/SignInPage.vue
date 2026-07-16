<script setup lang="ts">
import { signIn, type SignInUser } from '@/api/users';
import { HttpError } from '@/errors/http-error';
import { unknownErrorMessage } from '@/errors/unknown-error';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const signInUser: Ref<SignInUser> = ref({
    email: "",
    password: "",
})

async function signInFormHandler(){
    try {
        const signInResponse = await signIn({
            email: signInUser.value.email,
            password: signInUser.value.password
        })
    
        if (!signInResponse.ok) {
            throw signInResponse.error
        }

        router.push("/home")
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
<h2>Sign In</h2>
<form @submit.prevent="signInFormHandler">
    <div>
        <label for="email">Email</label>
        <input type="email" required name="email" v-model="signInUser.email">
    </div>
    <div>
        <label for="password">Password</label>
        <input type="password" required name="password" v-model="signInUser.password">
    </div>
    <button>Sign In</button>
</form>
<RouterLink to="/signup">Create New Account</RouterLink>
</template>