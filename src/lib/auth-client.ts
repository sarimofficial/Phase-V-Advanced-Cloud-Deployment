import { createAuthClient } from "better-auth/react"

// Determine the base URL based on the environment
// Always use the current origin to avoid CORS issues
const getBaseURL = () => {
  // In the browser, use the current origin (same domain as the page)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // For SSR, use the env variable as fallback
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL()
})

export const { signIn, signUp, signOut, useSession } = authClient
