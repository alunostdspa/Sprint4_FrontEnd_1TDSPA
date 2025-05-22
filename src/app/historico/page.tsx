"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllIncidentes, Gravidade } from "@/services/incidente-service"

export default function Historico() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allIncidents, setAllIncidents] = useState<any[]>([])

  const [filters, setFilters] = useState({
    gravidade: [] as string[],
    status: [] as string[],
    dataInicio: "",
    dataFim: "",
  })

  // Load incidents when component mounts
  useEffect(() => {
    loadIncidents()
  }, [])

  // Function to load incidents from API
  const loadIncidents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAllIncidentes()
      setAllIncidents(data)
    } catch (err) {
      console.error("Error loading incidents:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar incidentes")
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters to incidents
  const filteredIncidents = allIncidents.filter((incident) => {
    // Filter by gravidade
    if (filters.gravidade.length > 0 && !filters.gravidade.includes(incident.gravidade)) {
      return false
    }

    // Filter by status
    if (filters.status.length > 0) {
      const status = incident.isResolved ? "Resolvido" : "Em aberto"
      if (!filters.status.includes(status)) {
        return false
      }
    }

    // Filter by date range
    if (
      filters.dataInicio &&
      incident.createdAt &&
      new Date(incident.createdAt).toISOString().split("T")[0] < filters.dataInicio
    ) {
      return false
    }

    if (
      filters.dataFim &&
      incident.createdAt &&
      new Date(incident.createdAt).toISOString().split("T")[0] > filters.dataFim
    ) {
      return false
    }

    return true
  })

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      if (type === "gravidade" || type === "status") {
        // Toggle array values
        const currentValues = [...prev[type]]
        const index = currentValues.indexOf(value)

        if (index === -1) {
          currentValues.push(value)
        } else {
          currentValues.splice(index, 1)
        }

        return { ...prev, [type]: currentValues }
      } else {
        // Handle date inputs
        return { ...prev, [type]: value }
      }
    })
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      gravidade: [],
      status: [],
      dataInicio: "",
      dataFim: "",
    })
  }

  // Check if any filter is active
  const hasActiveFilters = () => {
    return (
      filters.gravidade.length > 0 || filters.status.length > 0 || filters.dataInicio !== "" || filters.dataFim !== ""
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const isValidImagePath = (path: string): boolean => {
    // Verifica se o caminho é um caminho válido de imagem
// Deve começar com uma barra ou ser uma URL absoluta
    if (!path) return false

    // Verifica se é uma URL válida ou se começa com uma barra
    return (
      path.startsWith("/") ||
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("data:image/")
    )
  }

  // Get image for incident
  const getImageForIncident = (incident: any) => {
    // If the incident has an uploaded image, use it
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

  // Navigate to incident details
  const handleViewIncident = (id: number) => {
    router.push(`/incidente/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <i className="fa-solid fa-history text-xl mr-2 text-[#9D1919]"></i>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Histórico de Incidentes</h1>
        </div>
        <button
          onClick={() => router.push("/registro-incidente")}
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
              <button onClick={loadIncidents} className="text-sm font-medium text-red-700 hover:text-red-900 mt-1">
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
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500">
              {filteredIncidents.length === allIncidents.length
                ? `Total: ${allIncidents.length} incidentes`
                : `Exibindo ${filteredIncidents.length} de ${allIncidents.length} incidentes`}
            </p>
            <button
              className={`flex items-center ${hasActiveFilters() ? "" : "text-gray-600"} transition-colors duration-200`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-filter text-sm mr-1"></i>
              <span className="text-sm">Filtrar</span>
              {hasActiveFilters() && (
                <span className="ml-1 bg-[#9D1919] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.gravidade.length +
                    filters.status.length +
                    (filters.dataInicio ? 1 : 0) +
                    (filters.dataFim ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-gray-100 transition-all duration-300">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-medium text-gray-700">Filtros</h2>
                <div className="flex items-center">
                  <button className="text-sm text-gray-500 mr-4" onClick={resetFilters}>
                    Limpar filtros
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowFilters(false)}>
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gravidade Filter */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Gravidade</h3>
                    <div className="space-y-2">
                      {[Gravidade.ALTA, Gravidade.MEDIA, Gravidade.BAIXA].map((gravidade) => (
                        <label key={gravidade} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={filters.gravidade.includes(gravidade)}
                            onChange={() => handleFilterChange("gravidade", gravidade)}
                          />
                          <span className="ml-2 text-gray-700">{gravidade}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Status</h3>
                    <div className="space-y-2">
                      {["Resolvido", "Em aberto"].map((status) => (
                        <label key={status} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={filters.status.includes(status)}
                            onChange={() => handleFilterChange("status", status)}
                          />
                          <span className="ml-2 text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Período</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">De</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
                          </div>
                          <input
                            type="date"
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                            value={filters.dataInicio}
                            onChange={(e) => handleFilterChange("dataInicio", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Até</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
                          </div>
                          <input
                            type="date"
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                            value={filters.dataFim}
                            onChange={(e) => handleFilterChange("dataFim", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                    onClick={() => setShowFilters(false)}
                  >
                    <i className="fa-solid fa-check text-sm mr-2"></i>
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-filter text-gray-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum incidente encontrado</h3>
              <p className="text-gray-500 mb-4">Não foram encontrados incidentes com os filtros selecionados.</p>
              <button
                onClick={resetFilters}
                className="text-[#9D1919] hover:text-[#b11c1c] font-medium transition-colors duration-200"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                  onClick={() => handleViewIncident(incident.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 p-4 flex justify-center items-start md:items-center">
                      <div className="relative w-full h-40 md:h-32 rounded-lg overflow-hidden">
                        <Image
                          src={getImageForIncident(incident) || "/imagens/default-image.png"}
                          alt="Imagem do incidente"
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="md:w-3/4 p-4 md:p-6">
                      <div className="flex flex-wrap items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{incident.nome}</h3>
                        <div className="flex items-center mt-1 md:mt-0">
                          <span className="text-xs text-gray-500 mr-2">
                            {formatDate(incident.createdAt)} às {formatTime(incident.createdAt)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              incident.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {incident.isResolved ? "Resolvido" : "Em aberto"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{incident.descricao}</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fa-solid fa-location-dot mr-1"></i>
                          <span>
                            {incident.latitude}, {incident.longitude}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <span className="mr-1 font-medium">Gravidade:</span>
                          <span
                            className={`${
                              incident.gravidade === Gravidade.ALTA
                                ? "text-red-600"
                                : incident.gravidade === Gravidade.MEDIA
                                  ? "text-amber-600"
                                  : "text-green-600"
                            }`}
                          >
                            {incident.gravidade}
                          </span>
                        </div>

                        {incident.criador && (
                          <div className="flex items-center text-sm text-gray-500">
                            <i className="fa-solid fa-user mr-1"></i>
                            <span>{incident.criador.nome || `ID: ${incident.criador.id}`}</span>
                          </div>
                        )}

                        {incident.imagemPath && (
                          <div className="flex items-center text-sm text-gray-500">
                            <i className="fa-solid fa-image mr-1"></i>
                            <span>Imagem anexada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
