/**
 * Tasks API proxy route - handles authentication and forwards to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const BACKEND_URL = process.env.BACKEND_URL || 'https://sarimdev-todoappphasevbackend.hf.space';

// Generate a consistent secret based on environment variable
const getAuthSecret = () => {
    const envSecret = process.env.BETTER_AUTH_SECRET;
    if (envSecret && envSecret.length >= 32) {
        return envSecret;
    }
    console.warn("BETTER_AUTH_SECRET is not set or too short (minimum 32 characters)");
    return "default-secure-secret-key-that-is-at-least-32-characters-long";
};

const BETTER_AUTH_SECRET = getAuthSecret();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get session from Better Auth using next/headers for reliable cookie access
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the user is accessing their own resources
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create JWT token for FastAPI backend
    const token = jwt.sign(
      {
        sub: session.user.id,
        user_id: session.user.id,
        email: session.user.email || '',
      },
      BETTER_AUTH_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Forward request to FastAPI backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/${userId}/tasks`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch tasks' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Tasks API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get session from Better Auth using next/headers for reliable cookie access
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the user is accessing their own resources
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create JWT token for FastAPI backend
    const token = jwt.sign(
      {
        sub: session.user.id,
        user_id: session.user.id,
        email: session.user.email || '',
      },
      BETTER_AUTH_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Get request body
    const body = await request.json();

    // Forward request to FastAPI backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/${userId}/tasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create task' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Tasks API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
