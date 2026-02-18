/**
 * Auth utilities for the frontend
 */

import { authClient } from "./auth-client";

/**
 * Check if the user is authenticated (client-side only helper)
 * Note: For Better Auth 1.0, real session check is async, but this 
 * can be used for quick redirection logic if session state is cached.
 */
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    // Better Auth stores session info in cookies. 
    // A quick way to check if a session might exist:
    return document.cookie.includes("better-auth.session-token") ||
        document.cookie.includes("auth_session");
};
