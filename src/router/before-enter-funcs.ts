import { getLoggedInUser } from "@/api/users"
import { HttpError } from "@/errors/http-error"
import { unknownErrorMessage } from "@/errors/unknown-error"
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

    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message)
        } else {
            console.log(error)
            alert(unknownErrorMessage)
        }
        localStorage.removeItem("userObj")
        return { path: "/signin" }
    }

}