import { createAuthClient } from "better-auth/react"

// Use the Next.js server URL for auth requests since auth is handled by Next.js API routes
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
    baseURL
})

export const { signIn, signUp, signOut, useSession } = authClient
