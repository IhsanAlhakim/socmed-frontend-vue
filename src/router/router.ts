import Home from "@/pages/Home.vue"
import SignIn from "@/pages/SignIn.vue"
import SignUp from "@/pages/SignUp.vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

let isAuthenticated = false

const routes: RouteRecordRaw[] = [
    {path: "/", component: SignIn},
    {path: "/signup", component: SignUp},
    {
        path: "/home", 
        component: Home,
        beforeEnter: async (to, from) => {
            try {
                let url = "http://localhost:8000/users"
                const response = await fetch(url, {
                method: "GET",
                headers: {
                "Content-Type":"application/json"
                },
                credentials: "include",
                })

                if (!response.ok) {
                    throw new Error("something went wrong")
                }
            } catch (error) {
                console.log("something went wrong")
                return {path: "/"}
            }

        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router