const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function apiFetch(path: string, option: RequestInit): Promise<Response> {
    const response = await fetch(`${apiBaseUrl}${path}`,option)
    return response
}