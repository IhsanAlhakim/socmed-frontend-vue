import Home from "@/pages/Home.vue"
import Login from "@/pages/Login.vue"
import SignUp from "@/pages/SignUp.vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
    {path: "/", component: Login},
    {path: "/signup", component: SignUp},
    {path: "/home", component: Home},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router