import { HttpError, statusInternalServerError } from "@/errors/http-error"
import type { APIRequestFunctionReturnType } from "./types"
import { unknownErrorMessage } from "@/errors/unknown-error"
import { apiFetch } from "./client"
import type { APIResponse } from "@/types/responseJson"

export interface SignInUser {
    email: string,
    password: string
}

export async function signIn(signInUserData: SignInUser): Promise<APIRequestFunctionReturnType> {
    const requestBody: SignInUser = {
        email: signInUserData.email,
        password: signInUserData.password
    }

    try {
        const response = await apiFetch("/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
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

export async function signOut(): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch("/sessions", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error(unknownErrorMessage)
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

export interface NewUserFormData {
    email: string,
    username: string,
    password: string,
    confirmPassword?: string,
}

export async function signUp(signUpUserData: NewUserFormData): Promise<APIRequestFunctionReturnType> {
    const requestBody = {
        email: signUpUserData.email,
        username: signUpUserData.username,
        password: signUpUserData.password
    }

    try {
        const response = await apiFetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
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

export async function getLoggedInUser(): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch("/users", {
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

export async function getUserByUsername(username: string): Promise<APIRequestFunctionReturnType> {
    try {
        const response = await apiFetch(`/users/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorResponse: string = await response.text()
            throw new HttpError(errorResponse, response.status)
        }

        const responseJSON: APIResponse = await response.json()

        return {
            ok: true,
            response: responseJSON
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