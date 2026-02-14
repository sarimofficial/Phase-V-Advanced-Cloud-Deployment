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

