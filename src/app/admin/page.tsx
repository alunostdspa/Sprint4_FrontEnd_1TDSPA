"use client"

import { useAuth, UserRole } from "@/context/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogoutButton } from "@/app/components/logout-button"

export default function AdminPage() {
  const { user, isAuthorized, isAdmin } = useAuth()
  const router = useRouter()

  
  useEffect(() => {
    
    if (!user) {
      router.push("/login")
    } else if (!isAuthorized([UserRole.ADMIN, UserRole.MANAGER])) {
      router.push("/login?error=unauthorized")
    }
  }, [user, isAuthorized, router])

  
  if (!user || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
      </div>
    )
  }

  
  const handleNavigateToIncidentes = () => {
    router.push("/admin/incidentes")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{user.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CPF</p>
              <p className="font-medium">{user.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{user.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cargo</p>
              <p className="font-medium">{user.cargo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Setor</p>
              <p className="font-medium">{user.setor}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 ">
          <h2 className="text-xl font-semibold mb-4">Ações Administrativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleNavigateToIncidentes}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              Gerenciar Incidentes
            </button>  
          </div>
        </div>
      </div>
    </div>
  )
}
