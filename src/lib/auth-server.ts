import { betterAuth } from "better-auth";
import dotenv from "dotenv";
import path from "path";
import { PostgresDialect } from "kysely";
import pg from "pg";

// Load environment variables from .env.local
// In Next.js, use process.cwd() to get project root
const envPath = path.resolve(process.cwd(), ".env.local");

dotenv.config({ path: envPath, override: true });

console.log('[auth-server] envPath:', envPath);
console.log('[auth-server] DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');

// For development, you might want to use a local database
// Set DATABASE_URL in your .env.local to a local PostgreSQL instance for development
const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
    console.error("DATABASE_URL is not set in .env.local");
}

// Create PostgreSQL dialect for Better Auth
const postgresDialect = new PostgresDialect({
    pool: new pg.Pool({ connectionString: databaseUrl }),
});

export const auth = betterAuth({
    database: postgresDialect,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-dev",
    advanced: {
        disableCSRFCheck: true, // Disable CSRF check which includes origin validation
    },
});
