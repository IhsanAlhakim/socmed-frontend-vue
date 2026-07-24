import z from "zod";

export const signUpSchema = z.object({
    email:z.email(),
    username: z.string().min(6, "Username must be at least 6 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const signInSchema = signUpSchema.omit({username: true})