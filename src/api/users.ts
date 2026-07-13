import { HttpError } from "@/errors/http-error"
import type { APIRequestFunctionReturnType } from "./types"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export interface SignInUser {
    email: string,
    password: string
}

export async function signIn(signInUserData: SignInUser): Promise<APIRequestFunctionReturnType> {
    let requestBody: SignInUser = {
        email: signInUserData.email,
        password: signInUserData.password
    }

    try {
        const apiUrl = `${apiBaseUrl}/sessions`
    
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
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