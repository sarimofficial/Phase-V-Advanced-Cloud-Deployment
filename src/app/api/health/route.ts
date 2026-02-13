import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint (Liveness Probe)
 *
 * Returns 200 OK if the application is running.
 * Used by Kubernetes liveness probe to determine if the container should be restarted.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'todo-frontend',
    },
    { status: 200 }
  );
}
