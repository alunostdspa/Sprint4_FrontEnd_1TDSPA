"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogoutButton } from "@/app/components/logout-button"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redireciona para login se não autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Mostra estado de carregamento enquanto verifica a autenticação
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel do Usuário</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo, {user.nome}!</h2>
          <p className="text-gray-600">
            Este é o seu painel de controle. Aqui você pode acessar todas as funcionalidades disponíveis para o seu
            cargo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div className="text-[#9D1919] mb-3">
              <i className="fa-solid fa-user-circle text-2xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Meu Perfil</h3>
            <p className="text-gray-500 text-sm mb-4">Visualize e edite suas informações pessoais</p>
            <button
              onClick={() => router.push("/profile")}
              className="text-[#9D1919] text-sm font-medium hover:underline"
            >
              Acessar Perfil
            </button>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div className="text-[#9D1919] mb-3">
              <i className="fa-solid fa-clipboard-list text-2xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Minhas Atividades</h3>
            <p className="text-gray-500 text-sm mb-4">Acompanhe suas tarefas e atividades</p>
            <button className="text-[#9D1919] text-sm font-medium hover:underline">Ver Atividades</button>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div className="text-[#9D1919] mb-3">
              <i className="fa-solid fa-bell text-2xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Notificações</h3>
            <p className="text-gray-500 text-sm mb-4">Veja suas notificações e alertas</p>
            <button className="text-[#9D1919] text-sm font-medium hover:underline">Ver Notificações</button>
          </div>
        </div>
      </div>
    </div>
  )
}
