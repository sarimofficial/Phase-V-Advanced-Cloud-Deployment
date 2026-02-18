/**
 * Better Auth API Route Handler
 * Handles all /api/auth/* requests
 */


import { auth } from '@/lib/auth-server'
import { toNextJsHandler } from 'better-auth/next-js'
import { getMigrations } from 'better-auth/db'

const handler = toNextJsHandler(auth);

// Track if migration has been attempted
let migrationAttempted = false;

// Auto-migrate on first request
async function ensureDatabaseTables() {
    if (migrationAttempted) return;

    try {
        migrationAttempted = true;
        console.log('[Auth] Checking database tables...');

        const { runMigrations } = await getMigrations({
            database: auth.options.database,
        });

        await runMigrations();
        console.log('[Auth] Database tables ready');
    } catch (error) {
        console.error('[Auth] Migration check failed:', error);
        // Don't throw - let the auth handler deal with it
    }
}

// Handle CORS preflight requests
export const OPTIONS = async (req: Request) => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
};

export const GET = async (req: Request) => {
    try {
        await ensureDatabaseTables();
        return await handler.GET(req);
    } catch (error) {
        console.error("Better Auth GET Error:", error);
        throw error;
    }
};

export const POST = async (req: Request) => {
    try {
        await ensureDatabaseTables();
        console.log('[Auth Route] POST request to:', req.url);
        console.log('[Auth Route] Origin:', req.headers.get('origin'));
        const response = await handler.POST(req);
        console.log('[Auth Route] Response status:', response.status);
        return response;
    } catch (error) {
        console.error("Better Auth POST Error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        throw error;
    }
};

