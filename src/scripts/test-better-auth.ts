// @ts-nocheck
import dotenv from 'dotenv';
import path from 'path';
import { betterAuth } from 'better-auth';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? 'Set' : 'Not set');

try {
    const auth = betterAuth({
        database: {
            provider: "pg",
            url: process.env.DATABASE_URL,
        },
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-dev",
    });

    console.log('✓ Better Auth initialized successfully');

    // Try to trigger the adapter initialization
    try {
        console.log('Triggering adapter initialization...');
        // Accessing auth.$Infer might trigger lazy initialization
        const _ = auth;
        console.log('✓ Adapter initialized');
    } catch (err) {
        console.error('✗ Failed to initialize adapter:', err);
        console.error('Error stack:', err instanceof Error ? err.stack : 'N/A');
    }
} catch (error) {
    console.error('✗ Failed to initialize Better Auth:', error);
    console.error('Error details:', error);
    if (error instanceof Error) {
        console.error('Stack:', error.stack);
    }
}
