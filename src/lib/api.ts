/**
 * API client for the Todo application
 * Uses Next.js API proxy routes for authentication
 */

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phase-v-advanced-cloud-deployment-w.vercel.app';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // Call Next.js API proxy which handles authentication server-side
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        } as any,
        credentials: 'include', // Include cookies for Better Auth session
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new ApiError(response.status, errorData.error || errorData.detail || response.statusText);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
        return undefined as T;
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
};
