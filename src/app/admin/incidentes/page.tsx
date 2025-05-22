"use client"

import { useAuth, UserRole } from "@/context/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogoutButton } from "@/app/components/logout-button"
import {
  getAllIncidentes,
  updateIncidente,
  deleteIncidente,
  resolveIncidente,
  Gravidade,
} from "@/services/incidente-service"

export default function AdminIncidentesPage() {
  const { user, isAuthorized, isAdmin } = useAuth()
  const router = useRouter()

  // State for incidents management
  const [incidents, setIncidents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingIncident, setEditingIncident] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all") // all, resolved, pending
  const [filterGravidade, setFilterGravidade] = useState<string>("all") // all, ALTA, MEDIA, BAIXA

// Verifica se o usuário está autorizado a acessar esta página
  useEffect(() => {
    // Redireciona se não estiver logado ou não autorizado
    if (!user) {
      router.push("/login")
    } else if (!isAuthorized([UserRole.ADMIN, UserRole.MANAGER])) {
      router.push("/login?error=unauthorized")
    } else {
      // Carrega os incidentes quando o componente é montado e o usuário está autorizado

      loadIncidents()
    }
  }, [user, isAuthorized, router])

  // Função para carregar incidentes da api
  const loadIncidents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAllIncidentes()
      setIncidents(data)
    } catch (err) {
      console.error("Error loading incidents:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar incidentes")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtra incidentes por status ou gravidade
  const filteredIncidents = incidents.filter((incident) => {
    // Filtra por status
    if (filterStatus !== "all") {
      const isResolved = filterStatus === "resolved"
      if (incident.isResolved !== isResolved) return false
    }

    // Filtra por gravidade
    if (filterGravidade !== "all" && incident.gravidade !== filterGravidade) {
      return false
    }

    return true
  })

  // Handle incident edit
  const handleEditIncident = (incident: any) => {
    setEditingIncident({ ...incident })
  }

  // Handle save edited incident
  const handleSaveIncident = async () => {
    if (!editingIncident) return

    setIsLoading(true)
    setError(null)

    try {
      await updateIncidente(editingIncident.id, editingIncident)
      setEditingIncident(null)
      loadIncidents()
    } catch (err) {
      console.error("Error updating incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao atualizar incidente")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete incident
  const handleDeleteIncident = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteIncidente(id)
      setShowDeleteConfirm(null)
      loadIncidents()
    } catch (err) {
      console.error("Error deleting incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao excluir incidente")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resolve incident
  const handleResolveIncident = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await resolveIncidente(id)
      loadIncidents()
    } catch (err) {
      console.error("Error resolving incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao resolver incidente")
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
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

  // Mostra o estado de carregamento enquanto verifica a autorização
  if (!user || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/admin")}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-2xl font-bold">Gerenciamento de Incidentes</h1>
        </div>
        <LogoutButton />
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

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="resolved">Resolvidos</option>
              <option value="pending">Pendentes</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              value={filterGravidade}
              onChange={(e) => setFilterGravidade(e.target.value)}
            >
              <option value="all">Todas as gravidades</option>
              <option value={Gravidade.ALTA}>Alta</option>
              <option value={Gravidade.MEDIA}>Média</option>
              <option value={Gravidade.BAIXA}>Baixa</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{filteredIncidents.length} incidente(s) encontrado(s)</span>
            <button
              onClick={loadIncidents}
              className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
              disabled={isLoading}
            >
              <i className={`fa-solid ${isLoading ? "fa-spinner fa-spin" : "fa-refresh"} mr-2`}></i>
              Atualizar
            </button>
          </div>
        </div>

        {isLoading && !editingIncident && !showDeleteConfirm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum incidente encontrado</h3>
            <p className="text-gray-500 mb-4">
              Não há incidentes registrados ou que correspondam aos filtros selecionados.
            </p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setFilterGravidade("all")
              }}
              className="text-[#9D1919] hover:text-[#b11c1c] font-medium transition-colors duration-200"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Título
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gravidade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{incident.nome}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{incident.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.gravidade === Gravidade.ALTA
                            ? "bg-red-100 text-red-800"
                            : incident.gravidade === Gravidade.MEDIA
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {incident.gravidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {incident.isResolved ? "Resolvido" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(incident.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditIncident(incident)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="Editar"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        {!incident.isResolved && (
                          <button
                            onClick={() => handleResolveIncident(incident.id)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Marcar como resolvido"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(incident.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Excluir"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          onClick={() => router.push(`/incidente/${incident.id}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Ver detalhes"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Incident Modal */}
      {editingIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Editar Incidente</h3>
                <button onClick={() => setEditingIncident(null)} className="text-gray-400 hover:text-gray-600">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título:</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    value={editingIncident.nome || ""}
                    onChange={(e) => setEditingIncident({ ...editingIncident, nome: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
                  <textarea
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 min-h-[100px]"
                    value={editingIncident.descricao || ""}
                    onChange={(e) => setEditingIncident({ ...editingIncident, descricao: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gravidade:</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white"
                    value={editingIncident.gravidade || ""}
                    onChange={(e) => setEditingIncident({ ...editingIncident, gravidade: e.target.value })}
                  >
                    <option value={Gravidade.BAIXA}>BAIXA</option>
                    <option value={Gravidade.MEDIA}>MEDIA</option>
                    <option value={Gravidade.ALTA}>ALTA</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude:</label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      value={editingIncident.latitude || ""}
                      onChange={(e) => setEditingIncident({ ...editingIncident, latitude: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-[#9D1919] focus:ring-[#9D1919] border-gray-300"
                        checked={!editingIncident.isResolved}
                        onChange={() => setEditingIncident({ ...editingIncident, isResolved: false })}
                      />
                      <span className="ml-2 text-gray-700">Pendente</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-[#9D1919] focus:ring-[#9D1919] border-gray-300"
                        checked={editingIncident.isResolved}
                        onChange={() => setEditingIncident({ ...editingIncident, isResolved: true })}
                      />
                      <span className="ml-2 text-gray-700">Resolvido</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingIncident(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveIncident}
                  className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-500 text-center mb-6">
                Tem certeza que deseja excluir este incidente? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteIncident(showDeleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Excluindo...
                    </>
                  ) : (
                    "Excluir"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
