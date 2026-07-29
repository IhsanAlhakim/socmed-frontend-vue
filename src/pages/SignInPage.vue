<script setup lang="ts">
import { signIn, type SignInUser } from '@/api/users';
import FormInputBox from '@/components/FormInputBox.vue';
import { HttpError } from '@/errors/http-error';
import { signInSchema } from '@/validation/validation';
import { CircleX } from '@lucide/vue';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const errorMessage: Ref<undefined | string> = ref(undefined)
const isLoading = ref(false)

const signInUser: Ref<SignInUser> = ref({
    email: "",
    password: "",
})

async function signInFormHandler() {
    isLoading.value = true

    const validationResult = signInSchema.safeParse({
        email: signInUser.value.email,
        password: signInUser.value.password
    })

    if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(issue => issue.message)
        errorMessage.value = errorMessages[0]
        isLoading.value = false
        return
    }

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
            errorMessage.value = error.message
        } else {
            console.log(error)
            errorMessage.value = "An unexpected error occurred: " + error
        }
    } finally {
        isLoading.value = false
    }

}

</script>

<template>
    <main class="w-full h-dvh grid grid-cols-5 bg-[#030712] text-white">
        <section class="flex col-span-2 items-center p-10 border-r-2">
            <div class="flex flex-col gap-2 w-full h-fit">
                <h2 class="text-right text-5xl font-bold">Sign in to Socmed</h2>
                <p class="text-right text-lg font-semibold">Enter your email and password</p>
            </div>
        </section>
        <section class="flex flex-col col-span-3 justify-center p-10">
            <form @submit.prevent="signInFormHandler" class="w-130 flex flex-col gap-3">
                <!-- <FormInputBoxUnderHood title="Email" type="email" name="email" :model-value="signInUser.email" @update:model-value="val => (signInUser.email = val)" /> -->
                <FormInputBox title="Email" name="email" v-model="signInUser.email" />
                <FormInputBox title="Password" type="password" name="password" v-model="signInUser.password" />
                <div v-if="errorMessage" @click="() => errorMessage = undefined"  class="flex gap-2 border-2 px-3 py-2 rounded-md border-red-500 my-2 cursor-pointer"><CircleX color="#f56565"/><p>{{ errorMessage }}</p></div>
                <div class="flex justify-end">                    
                        <button type="submit" :disabled="isLoading" class="px-4 py-2 rounded-full font-semibold cursor-pointer" :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500']">
                            <p v-if="isLoading">Signing In...</p>
                            <p v-else>Sign In</p>
                        </button>
                </div>
            </form>
            <div class="w-130 mt-2 text-center">
                <p>New to Socmed? <RouterLink to="/signup" class="text-blue-500 hover:text-blue-700">Create an account</RouterLink></p>
            </div>
        </section>
    </main>
</template>