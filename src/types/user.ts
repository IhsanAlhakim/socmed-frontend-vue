export interface UserData {
    id: number,
    username: string,
    email: string,
    created_at: string
    followed: boolean
}

export interface OtherUserData {
    id: number,
    username: string,
    created_at: string
}