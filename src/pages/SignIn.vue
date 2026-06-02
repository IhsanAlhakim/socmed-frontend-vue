<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';


interface SignInUser {
    email: string,
    password: string
}

const signInUser: Ref<SignInUser> = ref({
    email: "",
    password: "",
})

let router = useRouter()

async function signIn(){
    let requestBody: SignInUser = {
        email: signInUser.value.email,
        password: signInUser.value.password
    }

    try {
        let url = "http://localhost:8000/sessions"
    
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
        })
    
        if (!response.ok) {
            throw new Error("something went wrong")
        }
        router.push("/home")
    } catch (error) {
        alert("sign in failed")
        return
    }
}

</script>

<template>
<h2>Sign In</h2>
<form @submit.prevent="signIn">
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