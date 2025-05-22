"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { getIncidenteById, resolveIncidente, Gravidade } from "@/services/incidente-service"

export default function IncidenteDetalhes() {
  const router = useRouter()
  const params = useParams()
  const [incidente, setIncidente] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  // Load incident details when component mounts
  useEffect(() => {
    if (params.id) {
      loadIncidenteDetails(Number(params.id))
    }
  }, [params.id])

  // Function to load incident details from API
  const loadIncidenteDetails = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getIncidenteById(id)
      setIncidente(data)
    } catch (err) {
      console.error("Error loading incident details:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar detalhes do incidente")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to mark incident as resolved
  const handleResolveIncidente = async () => {
    if (!incidente || !incidente.id) return

    setIsResolving(true)
    setError(null)

    try {
      await resolveIncidente(incidente.id)
      // Update local state
      setIncidente({ ...incidente, isResolved: true })
    } catch (err) {
      console.error("Error resolving incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao resolver incidente")
    } finally {
      setIsResolving(false)
    }
  }

  // Function to get severity badge color
  const getSeverityBadgeColor = (gravidade: string) => {
    switch (gravidade) {
      case Gravidade.ALTA:
        return "bg-red-100 text-red-800"
      case Gravidade.MEDIA:
        return "bg-yellow-100 text-yellow-800"
      case Gravidade.BAIXA:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get image path from incident
  const getImagePath = (incident: any) => {
    // Check if imageUrl field exists and has a valid value
    if (incident.imageUrl && isValidImagePath(incident.imageUrl)) {
      return incident.imageUrl
    }

    // Backward compatibility: check if longitude contains a valid image path
    if (incident.longitude && isValidImagePath(incident.longitude)) {
      return incident.longitude
    }

    // Fallback to imagemPath if it exists and is valid (legacy field)
    if (incident.imagemPath && isValidImagePath(incident.imagemPath)) {
      return incident.imagemPath
    }

    // Otherwise, use a placeholder based on severity
    switch (incident.gravidade) {
      case Gravidade.ALTA:
        return "/imagens/default-image.png"
      case Gravidade.MEDIA:
        return "/imagens/default-image.png"
      case Gravidade.BAIXA:
        return "/imagens/default-image.png"
      default:
        return "/imagens/default-image.png"
    }
  }

  // Add this helper function to validate image paths
  const isValidImagePath = (path: string): boolean => {
    // Check if the path is a valid image path
    // It should start with a slash or be an absolute URL
    if (!path) return false

    // Check if it's a valid URL or starts with a slash
    return (
      path.startsWith("/") ||
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("data:image/")
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="flex items-center transition-colors duration-300 mb-8 group" onClick={() => router.back()}>
        <i className="fa-solid fa-arrow-left mr-2 group-hover:translate-x-[-2px] transition-transform"></i>
        <span className="font-medium">Voltar</span>
      </button>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
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

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
          </div>
        </div>
      ) : incidente ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#9D1919] text-white py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{incidente.nome || "Incidente"}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  incidente.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {incidente.isResolved ? "Resolvido" : "Em aberto"}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Display incident image if available */}
            {incidente.imageUrl || incidente.longitude || incidente.imagemPath ? (
              <div className="mb-6">
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={getImagePath(incidente) || "/imagens/default-image.png"}
                    alt="Imagem do incidente"
                    fill
                    className="object-contain"
                  />
                </div>
                {getImagePath(incidente) && isValidImagePath(getImagePath(incidente)) && (
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Caminho da imagem:</strong> {getImagePath(incidente)}
                  </p>
                )}
              </div>
            ) : incidente.gravidade ? (
              <div className="mb-6">
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={getImagePath(incidente) || "/imagens/default-image.png"}
                    alt="Imagem do incidente"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Gravidade</h2>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadgeColor(
                      incidente.gravidade,
                    )}`}
                  >
                    {incidente.gravidade || "Não classificado"}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Registrado por</h2>
                <p className="text-gray-800">{incidente.criador?.nome || "Sistema"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Localização</h2>
              <div className="flex items-center">
                <i className="fa-solid fa-location-dot mr-2 text-gray-400"></i>
                <p className="text-gray-800">{incidente.latitude || "Localização não especificada"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Descrição</h2>
              <p className="text-gray-800 whitespace-pre-wrap">{incidente.descricao}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Data de criação</h2>
                <p className="text-gray-800">{formatDate(incidente.createdAt)}</p>
              </div>

              {incidente.updatedAt && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Última atualização</h2>
                  <p className="text-gray-800">{formatDate(incidente.updatedAt)}</p>
                </div>
              )}
            </div>

            {!incidente.isResolved && (
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={handleResolveIncidente}
                  disabled={isResolving}
                  className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow flex items-center"
                >
                  {isResolving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2 text-sm"></i>
                      Processando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check mr-2 text-sm"></i>
                      Marcar como Resolvido
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <i className="fa-solid fa-triangle-exclamation text-amber-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-medium text-gray-700 mb-2">Incidente não encontrado</h2>
          <p className="text-gray-500 mb-6">O incidente solicitado não existe ou foi removido.</p>
          <button
            onClick={() => router.push("/notificacao")}
            className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Voltar para Notificações
          </button>
        </div>
      )}
    </div>
  )
}
