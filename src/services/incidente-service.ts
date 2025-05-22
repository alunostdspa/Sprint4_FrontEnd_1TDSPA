/**
 * Service for handling incident-related API calls
 */

// Define enum for Gravidade to match backend
export enum Gravidade {
  BAIXA = "BAIXA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
}

// Interface for incident data
export interface IncidenteData {
  id?: number
  latitude: string
  longitude: string
  descricao: string
  gravidade: Gravidade | null
  nome: string
  criador?: { id: number } | null
  isResolved: boolean
  imageUrl?: string | null // Add imageUrl field
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

/**
 * Create a new incident
 */
export async function createIncidente(incidenteData: IncidenteData): Promise<any> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(incidenteData),
  })

  // Get response text first for debugging
  const responseText = await response.text()
  console.log("Response text:", responseText)

  // Try to parse as JSON if possible
  let data = null
  try {
    data = responseText ? JSON.parse(responseText) : null
  } catch (e) {
    console.error("Failed to parse response as JSON:", e)
  }

  if (!response.ok) {
    throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
  }

  return data
}

/**
 * Get all incidents
 */
export async function getAllIncidentes(): Promise<any[]> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes`, {
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
 * Get incident by ID
 */
export async function getIncidenteById(id: number): Promise<any> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes/${id}`, {
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
 * Update an incident
 */
export async function updateIncidente(id: number, incidenteData: IncidenteData): Promise<any> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(incidenteData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Delete an incident
 */
export async function deleteIncidente(id: number): Promise<void> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
  }
}

/**
 * Mark an incident as resolved
 */
export async function resolveIncidente(id: number): Promise<any> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes/${id}/resolver`, {
    method: "PUT",
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
 * Get incidents by severity
 */
export async function getIncidentesByGravidade(gravidade: Gravidade): Promise<any[]> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/incidentes/gravidade/${gravidade}`, {
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
