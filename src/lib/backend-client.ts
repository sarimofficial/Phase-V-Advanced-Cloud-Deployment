/**
 * Backend API client that uses Next.js proxy routes.
 * These proxy routes handle Better Auth session verification 
 * and generate JWTs for the FastAPI backend.
 */

interface BackendRequestInit extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: BackendRequestInit = {}
): Promise<T> {
  // We don't need to manually handle tokens here because the 
  // Next.js proxy routes will use the authentication cookies
  // already present in the browser.

  // Use current origin by default to hit Next.js API routes
  const API_URL = '';

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(errorData.error || errorData.detail || response.statusText);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  tasks: {
    list: (userId: string) => fetchWithAuth<any[]>(`/api/tasks/${userId}`),
    create: (userId: string, data: any) =>
      fetchWithAuth<any>(`/api/tasks/${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleComplete: (userId: string, taskId: number) =>
      fetchWithAuth<any>(`/api/tasks/${userId}/${taskId}/complete`, {
        method: 'PATCH',
      }),
    update: (userId: string, taskId: number, data: any) =>
      fetchWithAuth<any>(`/api/tasks/${userId}/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (userId: string, taskId: number) =>
      fetchWithAuth<void>(`/api/tasks/${userId}/${taskId}`, {
        method: 'DELETE',
      }),
  },
  chat: {
    send: (userId: string, message: string) =>
      fetchWithAuth<any>(`/api/chat/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  },
};
