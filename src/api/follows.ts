import { HttpError } from "@/errors/http-error"
import { apiFetch } from "./client"

export async function followUser(followedUserId: number) {
    try {
        const response = await apiFetch(`/follows/${followedUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse,response.status)
        }

        return {
            ok: true
        }

    } catch (error) {
        if (error instanceof HttpError) {
            return {
                ok: false,
                error: error,
                statusCode: error.statusCode
            }
        }
        return {
            ok: false,
            error: error
        }
    }
}

export async function unfollowUser(followedUserId: number) {
    try {
        const response = await apiFetch(`/follows/${followedUserId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse, response.status)
        }

        return {
            ok: true
        }

    } catch (error) {
        if (error instanceof HttpError) {
            return {
                ok: false,
                error: error,
                statusCode: error.statusCode
            }
        }
        return {
            ok: false,
            error: error
        }
    }
}