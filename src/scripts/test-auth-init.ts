// @ts-nocheck
import dotenv from 'dotenv';
import path from 'path';
import { betterAuth } from 'better-auth';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

console.log('Testing Better Auth initialization...');
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('BETTER_AUTH_SECRET set:', !!process.env.BETTER_AUTH_SECRET);

try {
    const auth = betterAuth({
        database: {
            provider: 'postgres',
            url: process.env.DATABASE_URL,
        },
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        secret: process.env.BETTER_AUTH_SECRET || 'test-secret',
    });
    console.log('Better Auth initialized successfully:', typeof auth);
} catch (error) {
    console.error('Failed to initialize Better Auth:', error);
    process.exit(1);
}
