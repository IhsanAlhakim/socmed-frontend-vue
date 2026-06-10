import type { APIResponse } from "@/types/responseJson"
import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router"

export async function beforeEnterRoot(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric) {
    try {
        let url = "http://localhost:8000/users"

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
        return { path: "/signin" }
    }

}