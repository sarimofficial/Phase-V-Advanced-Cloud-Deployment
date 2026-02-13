import { createAuthClient } from "better-auth/react"

// Determine the base URL based on the environment
// For local development, use localhost; for production, use the configured URL
const getBaseURL = () => {
  // Check if we're in development mode (localhost)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "https://sarimdev-todoappphasevbackend.hf.space";
  }
  // For production or other environments, use the env variable
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://sarimdev-todoappphasevbackend.hf.space";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL()
})

export const { signIn, signUp, signOut, useSession } = authClient
