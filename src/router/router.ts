import RootLayout from "@/layouts/RootLayout.vue"
import Home from "@/pages/Home.vue"
import SignIn from "@/pages/SignIn.vue"
import SignUp from "@/pages/SignUp.vue"
import type { APIResponse } from "@/types/responseJson"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
    {path: "/signin", component: SignIn},
    {path: "/signup", component: SignUp},
    {
        path: "/", 
        component: RootLayout,
        children: [
            {path: "home", component: Home}
        ],
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

                let responseJson: APIResponse = await response.json()

                localStorage.setItem("userObj", JSON.stringify(responseJson.data))

            } catch (error) {
                console.log("something went wrong")
                localStorage.removeItem("userObj")
                return {path: "/signin"}
            }

        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router