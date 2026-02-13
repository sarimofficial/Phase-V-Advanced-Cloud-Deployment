import { NextResponse } from 'next/server';

/**
 * Readiness Check Endpoint (Readiness Probe)
 *
 * Returns 200 OK if the application is ready to serve traffic.
 * Used by Kubernetes readiness probe to determine if traffic should be routed to this pod.
 *
 * For the frontend, this checks if the application has initialized successfully.
 */
export async function GET() {
  try {
    // Check if environment variables are configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          status: 'not_ready',
          reason: 'NEXT_PUBLIC_API_URL not configured',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Application is ready
    return NextResponse.json(
      {
        status: 'ready',
        timestamp: new Date().toISOString(),
        service: 'todo-frontend',
        config: {
          apiUrl: apiUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'not_ready',
        reason: 'Initialization error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
