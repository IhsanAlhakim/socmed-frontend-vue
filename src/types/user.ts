export interface UserData {
    id: number,
    username: string,
    email: string,
    created_at: string
    followed: boolean
    following_count: number,
    follower_count: number,
}

export interface OtherUserData {
    id: number,
    username: string,
    created_at: string
}