<script setup lang="ts">
import { signUp, type NewUserFormData } from '@/api/users';
import Button from '@/components/Button.vue';
import FormErrorMessage from '@/components/FormErrorMessage.vue';
import FormInputBox from '@/components/FormInputBox.vue';
import SignInUpMain from '@/components/SignInUpMain.vue';
import { HttpError } from '@/errors/http-error';
import { signUpSchema } from '@/validation/validation';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const newUser: Ref<NewUserFormData> = ref({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
})

const router = useRouter()

const errorMessage: Ref<undefined | string> = ref(undefined)
const isLoading = ref(false)


async function signUpFormHandler() {
    if (newUser.value.password !== newUser.value.confirmPassword) {
        errorMessage.value = "passwords do not match, please retype your password"
        return
    }

    const validationResult = signUpSchema.safeParse({
        email: newUser.value.email,
        username: newUser.value.username,
        password: newUser.value.password
    })

    if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(issue => issue.message)
        errorMessage.value = errorMessages[0]
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

        toast.success('Your account has been successfully created', {
            action: {
                label: 'Close'
            }
        })

        router.push("/signin")
    } catch (error) {
        if (error instanceof HttpError) {
            errorMessage.value = error.message
        } else {
            console.log(error)
            errorMessage.value = "An unexpected error occurred: " + error
        }
    }
}

</script>

<template>
    <SignInUpMain>
        <section class="flex col-span-2 items-center p-10 border-r-2">
            <div class="flex flex-col gap-2 w-full h-fit">
                <h2 class="text-right text-5xl font-bold">Create your Socmed account</h2>
                <p class="text-right text-lg font-semibold">Sign up to interact with your friends</p>
            </div>
        </section>
        <section class="flex flex-col col-span-3 justify-center p-10">
            <form @submit.prevent="signUpFormHandler" class="w-130 flex flex-col gap-3">
                <FormErrorMessage v-if="errorMessage" @click="() => errorMessage = undefined">
                    {{ errorMessage }}
                </FormErrorMessage>
                <FormInputBox title="Email" name="email" v-model="newUser.email" />
                <FormInputBox title="Username" name="username" v-model="newUser.username" />
                <FormInputBox title="Password" type="password" name="password" v-model="newUser.password" />
                <FormInputBox title="Confirm Your Password" type="password" name="confirm_password"
                    v-model="newUser.confirmPassword" />
                <div class="flex justify-between">
                    <Button type="button" class="bg-gray-700 hover:bg-gray-500">
                        <RouterLink to="/signin">Back</RouterLink>
                    </Button>
                    <Button type="submit" :is-disabled="isLoading"
                        :class="[isLoading ? 'bg-gray-700' : 'bg-sky-700 hover:bg-sky-500']">
                        <p v-if="isLoading">Creating your account...</p>
                        <p v-else>Create account</p>
                    </Button>
                </div>
            </form>
        </section>
    </SignInUpMain>
</template>