/**
 * Individual task API proxy route - handles authentication and forwards to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const BACKEND_URL = process.env.BACKEND_URL || 'https://sarimdev-todoappphasevbackend.hf.space';
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || '';

export async function GET(
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
      `${BACKEND_URL}/api/${userId}/tasks/${taskId}`,
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
        { error: errorData.detail || 'Failed to fetch task' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Task API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Get request body
    const body = await request.json();

    // Forward request to FastAPI backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/${userId}/tasks/${taskId}`,
      {
        method: 'PUT',
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
        { error: errorData.detail || 'Failed to update task' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Task API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      `${BACKEND_URL}/api/${userId}/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to delete task' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Task API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
