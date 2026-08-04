import RootLayout from "@/layouts/RootLayout.vue"
import HomePage from "@/pages/HomePage.vue"
import PostPage from "@/pages/PostPage.vue"
import SignIn from "@/pages/SignInPage.vue"
import SignUp from "@/pages/SignUpPage.vue"
import UserPage from "@/pages/UserPage.vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { beforeEnterRoot } from "./before-enter-funcs"

const routes: RouteRecordRaw[] = [
    { path: "/signin", component: SignIn },
    { path: "/signup", component: SignUp },
    {
        path: "/",
        component: RootLayout,
        children: [
            { path: "home", component: HomePage },
            { path: "p/:postId", component: PostPage, props: true },
            { path: "u/:username", component: UserPage, props: true }
        ],
        beforeEnter: beforeEnterRoot,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    async scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(savedPosition)
                }, 100)
            })
        } else {
            return { top: 0 }
        }
    }
})

export default router