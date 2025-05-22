"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

// Define enum for Gravidade to match backend
enum GravidadeEnum {
  BAIXA = "BAIXA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
}

export default function RegistroIncidenteSimples() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form fields
  const [gravidade, setGravidade] = useState("")
  const [tipoIncidente, setTipoIncidente] = useState("")
  const [descricao, setDescricao] = useState("")
  const [localIncidente, setLocalIncidente] = useState("")

  /**
   * Handle form submission
   * - Validates form data
   * - Sends data to backend API
   * - Handles success/error responses
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Map form values to backend expected structure
      const incidenteData = {
        latitude: localIncidente, // Store place name in latitude field
        longitude: "", // Empty string for longitude
        descricao,
        gravidade: mapGravidadeToEnum(gravidade),
        nome: tipoIncidente,
        criador: user ? { id: user.id } : null,
        isResolved: false,
        imageUrl: "", // Empty string for imageUrl since no image is uploaded
      }

      console.log("Sending incident data:", incidenteData)

      // Send data to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(incidenteData),
      })

      // Log the full response for debugging
      console.log("Response status:", response.status)

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
        throw new Error(data?.message || `Erro ao registrar incidente: ${response.status} ${response.statusText}`)
      }

      // Handle success
      setSuccess(true)
      console.log("Incidente registrado com sucesso:", data)

      // Reset form
      setGravidade("")
      setTipoIncidente("")
      setDescricao("")
      setLocalIncidente("")

      // Show success message and redirect after delay
      setTimeout(() => {
        router.push("/historico")
      }, 2000)
    } catch (err) {
      console.error("Error submitting incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao registrar incidente")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maps the form gravidade value to the backend enum
   */
  const mapGravidadeToEnum = (gravidade: string): string | null => {
    switch (gravidade.toLowerCase()) {
      case "baixa":
        return "BAIXA"
      case "media":
        return "MEDIA"
      case "alta":
        return "ALTA"
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="flex items-center transition-colors duration-300 mb-8 group" onClick={() => router.back()}>
        <i className="fa-solid fa-arrow-left mr-2 group-hover:translate-x-[-2px] transition-transform"></i>
        <span className="font-medium">Voltar</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#9D1919] text-white py-4 px-6">
          <h1 className="text-xl font-semibold">Registro de Incidente Simples</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-check-circle"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">Incidente registrado com sucesso! Redirecionando...</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gravidade:</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white"
                value={gravidade}
                onChange={(e) => setGravidade(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Selecione a gravidade</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente:</label>
              <input
                type="text"
                placeholder="Ex: Falha no sistema, Acidente, etc."
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                value={tipoIncidente}
                onChange={(e) => setTipoIncidente(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Local do Incidente:</label>
            <input
              type="text"
              placeholder="Ex: Estação Osasco-Linha Diamante"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              value={localIncidente}
              onChange={(e) => setLocalIncidente(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <i className="fa-solid fa-location-dot mr-1"></i>
              <span>Informe o local exato do incidente</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
            <textarea
              placeholder="Descreva o incidente em detalhes..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 min-h-[150px] resize-y"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-amber-600">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              <span className="text-sm">Verifique as informações antes de enviar</span>
            </div>

            <button
              type="submit"
              className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2 text-sm"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2 text-sm"></i>
                  Enviar Registro
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
