import { HttpError } from "@/errors/http-error"
import { apiFetch } from "./client"
import type { APIRequestFunctionReturnType } from "./types"
import type { APIResponse } from "@/types/responseJson"

export async function createPostComment(postId: number, commentContent: string): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/posts/${postId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                "content": commentContent
            })
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse)
        }

        return {
            ok: true,
        }
        
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}

export async function deletePostComment(commentId: number): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse)
        }

        return {
            ok: true,
        }
        
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}

export async function getPostComments(postId: number): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/posts/${postId}/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse)
        }

        const responseJSON: APIResponse = await response.json()

        return {
            ok: true,
            response: responseJSON
        }
        
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}