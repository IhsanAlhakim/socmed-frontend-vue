import { HttpError } from "@/errors/http-error"
import { apiFetch } from "./client"

export async function likePost(postId: number) {
    try {
        const response = await apiFetch(`/posts/${postId}/likes`, {
            method: "POST",
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

export async function unlikePost(postId: number) {
    try {
        const response = await apiFetch(`/posts/${postId}/likes`, {
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