/**
 * Task complete API proxy route - handles authentication and forwards to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || '';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; taskId: string }> }
) {
  try {
    const { userId, taskId } = await params;

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
      `${BACKEND_URL}/api/${userId}/tasks/${taskId}/complete`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to toggle task completion' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Task complete API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
