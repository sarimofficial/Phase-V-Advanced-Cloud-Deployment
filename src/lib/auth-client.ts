import { createAuthClient } from "better-auth/react"

// Determine the base URL based on the environment
// For local development, use localhost; for production, use the configured Vercel URL
const getBaseURL = () => {
  // Check if we're in development mode (localhost)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "http://localhost:3000";
  }
  // For production or other environments, use the Vercel deployment
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://phase-v-advanced-cloud-deployment-w.vercel.app";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL()
})

export const { signIn, signUp, signOut, useSession } = authClient
