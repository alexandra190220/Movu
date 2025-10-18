// Use Vite environment variable VITE_API_URL in production; fallback to localhost only in development
const envUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!envUrl && import.meta.env.MODE !== 'development') {
  throw new Error(
    'VITE_API_URL no está definido. Define VITE_API_URL en las Environment Variables de Vercel antes de build.'
  );
}

export const API_URL = envUrl ?? 'http://localhost:3000/api/v1';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/sessions/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Try to parse JSON, but handle HTML or plain text error pages gracefully
  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    // If backend returned JSON with error field, prefer it
    const message = data?.error || data?.message || text || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data; // { message, userId }
}

export async function registerUser(firstName: string, lastName: string, age: number, email: string, password: string) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, age, email, password }),
  });

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || text || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}
