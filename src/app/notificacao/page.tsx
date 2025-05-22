"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAllIncidentes, Gravidade } from "@/services/incidente-service"

// Define the notification interface based on incident data
interface Notification {
  id: number
  title: string
  description: string
  image: string
  date: string
  time: string
  isNew: boolean
  gravidade: string
  location: string
}

export default function Notificacao() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use useCallback to memoize the function
  const loadUnresolvedIncidents = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get all incidents
      const incidents = await getAllIncidentes()

      // Filter only unresolved incidents
      const unresolvedIncidents = incidents.filter((incident) => !incident.isResolved)

      // Transform incidents into notification format
      const notificationsData = unresolvedIncidents.map((incident) => {
        // Create a date object from the incident's creation date or use current date
        const incidentDate = incident.createdAt ? new Date(incident.createdAt) : new Date()

        // Format date as DD/MM/YYYY
        const formattedDate = `${incidentDate.getDate().toString().padStart(2, "0")}/${(incidentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${incidentDate.getFullYear()}`

        // Format time as HH:MM
        const formattedTime = `${incidentDate.getHours().toString().padStart(2, "0")}:${incidentDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`

        // Determine if the incident is "new" (less than 24 hours old)
        const isNew = Date.now() - incidentDate.getTime() < 24 * 60 * 60 * 1000

        // Get image based on severity or use uploaded image if available
        const getImageForIncident = (incident: any) => {
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
          return "/imagens/default-image.png"
        }

        // Create notification title based on incident type and severity
        const title = `${incident.nome || "Incidente"} - ${incident.gravidade || "Não classificado"}`

        return {
          id: incident.id,
          title: title,
          description: incident.descricao,
          image: getImageForIncident(incident),
          date: formattedDate,
          time: formattedTime,
          isNew: isNew,
          gravidade: incident.gravidade,
          location: incident.latitude || "Localização não especificada",
        }
      })

      setNotifications(notificationsData)
    } catch (err) {
      console.error("Error loading incidents:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar incidentes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load unresolved incidents when component mounts
  useEffect(() => {
    loadUnresolvedIncidents()
  }, [loadUnresolvedIncidents])

  // Function to get severity badge color
  const getSeverityBadgeColor = (gravidade: string) => {
    switch (gravidade) {
      case Gravidade.ALTA:
        return "bg-red-100 text-red-800 border-red-200"
      case Gravidade.MEDIA:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case Gravidade.BAIXA:
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Navigate to incident details
  const handleViewIncident = (id: number) => {
    router.push(`/incidente/${id}`)
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <i className="fa-solid fa-bell text-xl mr-2 text-[#9D1919]"></i>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Incidentes Não Resolvidos</h1>
        </div>
        <button
          onClick={() => router.push("/registro-escolha")}
          className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center text-sm"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Novo Incidente
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
              <button
                onClick={loadUnresolvedIncidents}
                className="text-sm font-medium text-red-700 hover:text-red-900 mt-1"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <i className="fa-solid fa-check-circle text-green-500 text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum incidente pendente</h3>
              <p className="text-gray-500">Todos os incidentes foram resolvidos.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex p-4 md:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    notification.isNew ? "bg-[#9D1919]/5" : ""
                  }`}
                  onClick={() => handleViewIncident(notification.id)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                      <Image
                        src={notification.image || "/imagens/default-image.png"}
                        alt="Imagem da notificação"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                        {notification.title}
                        {notification.isNew && (
                          <span className="ml-2 bg-[#9D1919] text-white text-xs px-2 py-0.5 rounded-full">Novo</span>
                        )}
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getSeverityBadgeColor(notification.gravidade)}`}
                      >
                        {notification.gravidade}
                      </span>
                      <span className="text-xs text-gray-500">{notification.date}</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <i className="fa-solid fa-location-dot mr-1 text-gray-400"></i>
                        {notification.location}
                      </span>
                      {notification.image && isValidImagePath(notification.image) && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <i className="fa-solid fa-image mr-1 text-gray-400"></i>
                          Imagem anexada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
