/**
 * Service for handling user-related API calls
 */

// Define interfaces for user data
export interface UserData {
  id: number
  nome: string
  email: string
  cpf?: string
  telefone?: string
  cargo?: string
  setor?: string
  endereco_id?: number
}

export interface PasswordChangeData {
  senhaAtual: string
  novaSenha: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

/**
 * Get the current authenticated user's data
 */
export async function getCurrentUser(): Promise<UserData> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/usuarios/me`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<UserData> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Update user profile
 */
export async function updateUserProfile(userData: UserData): Promise<UserData> {
  const token = localStorage.getItem("token")

  if (!userData.id) {
    throw new Error("ID do usuário não fornecido")
  }

  const response = await fetch(`${API_URL}/usuarios/${userData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage

    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorText
    } catch {
      errorMessage = errorText || `Error ${response.status}: ${response.statusText}`
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Change user password
 */
export async function changePassword(userId: number, passwordData: PasswordChangeData): Promise<void> {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const response = await fetch(`/api/users/${userId}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "X-User-Email": user.email || "",
    },
    body: JSON.stringify(passwordData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage

    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorText
    } catch {
      errorMessage = errorText || `Error ${response.status}: ${response.statusText}`
    }

    throw new Error(errorMessage)
  }
}
