import { HttpError } from "@/errors/http-error"
import { apiFetch } from "./client"
import type { APIRequestFunctionReturnType } from "./types"
import type { APIResponse } from "@/types/responseJson"

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

export async function deletePost(postId: number): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/posts/${postId}`, {
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
            ok: true
        }
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}

export async function getPost(): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch("/posts", {
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

export async function getPostById(postId: number): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/posts/${postId}`, {
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

export async function getPostsByUsername(username: string): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/users/${username}/posts`, {
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