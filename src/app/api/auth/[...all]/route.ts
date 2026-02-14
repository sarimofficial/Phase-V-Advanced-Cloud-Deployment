/**
 * Better Auth API Route Handler
 * Handles all /api/auth/* requests
 */


import { auth } from '@/lib/auth-server'
import { toNextJsHandler } from 'better-auth/next-js'

const handler = toNextJsHandler(auth);

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
        return await handler.GET(req);
    } catch (error) {
        console.error("Better Auth GET Error:", error);
        throw error;
    }
};

export const POST = async (req: Request) => {
    try {
        return await handler.POST(req);
    } catch (error) {
        console.error("Better Auth POST Error:", error);
        throw error;
    }
};

