import { fetchApi } from "./api"

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  tipo: string
  usuario: {
    id: number
    nome: string
    email: string
    cargo: string
    setor: string
  }
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function saveAuthData(data: LoginResponse): void {
  localStorage.setItem("token", data.token)
  localStorage.setItem("tokenType", data.tipo)
  localStorage.setItem("user", JSON.stringify(data.usuario))
}

export function getAuthData(): { token: string; user: any } | null {
  const token = localStorage.getItem("token")
  const userStr = localStorage.getItem("user")

  if (!token || !userStr) {
    return null
  }

  return {
    token,
    user: JSON.parse(userStr),
  }
}

export function clearAuthData(): void {
  localStorage.removeItem("token")
  localStorage.removeItem("tokenType")
  localStorage.removeItem("user")
}

export function isAdmin(user: any): boolean {
  return user?.cargo === "ADMIN"
}
