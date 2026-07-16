import { HttpError } from "@/errors/http-error"
import { apiFetch } from "./client"
import type { APIRequestFunctionReturnType } from "./types"

export interface CreatePostRequestBody {
    content: string
}

export async function createPost(postContent: string): Promise<APIRequestFunctionReturnType> {
    const requestBody: CreatePostRequestBody = {
        content: postContent
    }

    try {
        const response = await apiFetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse)
        }

        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}