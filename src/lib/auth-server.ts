import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import pg from "pg";

// For development, you might want to use a local database
// Set DATABASE_URL in your .env.local to a local PostgreSQL instance for development
const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
    console.error("DATABASE_URL is not set in environment variables");
}

// Create PostgreSQL dialect for Better Auth
const postgresDialect = new PostgresDialect({
    pool: new pg.Pool({ connectionString: databaseUrl }),
});

// Get the base URL from Vercel's environment variables or fallback
const getBaseURL = () => {
    // Vercel provides VERCEL_URL for the current deployment
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    // Fallback to configured URLs (should be frontend URLs, not backend)
    return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

// Generate a consistent secret based on environment variable
const getAuthSecret = () => {
    const envSecret = process.env.BETTER_AUTH_SECRET;
    if (envSecret && envSecret.length >= 32) {
        return envSecret;
    }
    console.warn("BETTER_AUTH_SECRET is not set or too short (minimum 32 characters)");
    return "default-secure-secret-key-that-is-at-least-32-characters-long";
};

export const auth = betterAuth({
    database: postgresDialect,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    secret: getAuthSecret(),
    baseURL: getBaseURL(),
    // Don't set trustedOrigins - let Better Auth infer from baseURL
    // This allows same-origin requests from whatever URL is set as baseURL
    session: {
        expiresIn: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
    },
});
