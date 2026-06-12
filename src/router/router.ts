import RootLayout from "@/layouts/RootLayout.vue"
import Home from "@/pages/Home.vue"
import SignIn from "@/pages/SignIn.vue"
import SignUp from "@/pages/SignUp.vue"
import type { APIResponse } from "@/types/responseJson"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { beforeEnterRoot } from "./before_enter_func"
import PostPage from "@/pages/PostPage.vue"

const routes: RouteRecordRaw[] = [
    {path: "/signin", component: SignIn},
    {path: "/signup", component: SignUp},
    {
        path: "/", 
        component: RootLayout,
        children: [
            {path: "home", component: Home},
            {path: "p/:postId", component: PostPage, props: true}
        ],
        beforeEnter: beforeEnterRoot,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router