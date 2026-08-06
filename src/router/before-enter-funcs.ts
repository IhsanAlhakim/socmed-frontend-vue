import { getLoggedInUser } from "@/api/users"
import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router"

export async function beforeEnterRoot(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric) {
    try {
        const getLoggedInUserResponse = await getLoggedInUser()

        if (!getLoggedInUserResponse.ok) {
            throw getLoggedInUserResponse.error
        }

        if (!getLoggedInUserResponse.response) {
            throw new Error("empty response")
        }

        localStorage.setItem("userObj", JSON.stringify(getLoggedInUserResponse.response.data))
        
        if (to.path == "/") {
            return {path: "/home"}
        }

    } catch (error) {
        console.log(error)
        localStorage.removeItem("userObj")
        return { path: "/signin" }
    }

}