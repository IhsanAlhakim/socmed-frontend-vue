export interface Post {
    id: number,
    user_id: number,
    creator: string,
    content: string,
    created_at: string
    like_count: number,
    comment_count: number,
    liked: boolean
}