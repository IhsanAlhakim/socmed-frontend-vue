import type { APIResponse } from "@/types/responseJson"

export interface APIRequestFunctionReturnType {
    ok: boolean
    response?: APIResponse
    error?: any
    statusCode?: number
}