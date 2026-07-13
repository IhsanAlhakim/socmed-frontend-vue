import RootLayout from "@/layouts/RootLayout.vue"
import Home from "@/pages/Home.vue"
import PostPage from "@/pages/PostPage.vue"
import SignIn from "@/pages/SignInPage.vue"
import SignUp from "@/pages/SignUp.vue"
import UserPage from "@/pages/UserPage.vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { beforeEnterRoot } from "./before_enter_func"

const routes: RouteRecordRaw[] = [
    {path: "/signin", component: SignIn},
    {path: "/signup", component: SignUp},
    {
        path: "/", 
        component: RootLayout,
        children: [
            {path: "home", component: Home},
            {path: "p/:postId", component: PostPage, props: true},
            {path: "u/:username", component: UserPage, props: true}
        ],
        beforeEnter: beforeEnterRoot,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router