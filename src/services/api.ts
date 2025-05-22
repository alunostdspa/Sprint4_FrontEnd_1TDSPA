// Base API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Generic fetch function with error handling
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || response.statusText)
  }

  // Return empty object for 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Add authorization header to requests
export function withAuth(options: RequestInit = {}): RequestInit {
  const token = localStorage.getItem("token")

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
}
