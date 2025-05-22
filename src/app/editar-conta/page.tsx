"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getCurrentUser, updateUserProfile, changePassword, type UserData } from "@/services/user-service"

export default function EditarConta() {
  const router = useRouter()
  const { user: authUser, setUser: setAuthUser } = useAuth()


  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cargo: "",
    setor: "",
  })

  
  const [passwordData, setPasswordData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Carrega os dados do usuário quando o componente é montado
  useEffect(() => {
    if (!authUser) {
      router.push("/login")
      return
    }

    loadUserData()
  }, [authUser, router])

  
  const loadUserData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getCurrentUser()
      setUserData(data)
    } catch (err) {
      console.error("Error loading user data:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar dados do usuário")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle profile form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle profile form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedUser = await updateUserProfile(userData)

      // Atualiza o contexto de autenticação se o email ou nome forem alterados
      if (authUser && (updatedUser.email !== authUser.email || updatedUser.nome !== authUser.nome)) {
        setAuthUser({
          ...authUser,
          email: updatedUser.email,
          nome: updatedUser.nome,
        })

        // Update localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...parsedUser,
              email: updatedUser.email,
              nome: updatedUser.nome,
            }),
          )
        }
      }

      setSuccess("Perfil atualizado com sucesso!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validate passwords match
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      setPasswordError("As senhas não coincidem")
      return
    }

    // Validate password length
    if (passwordData.novaSenha.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsChangingPassword(true)

    try {
      if (!userData.id) {
        throw new Error("ID do usuário não encontrado")
      }

      await changePassword(userData.id, {
        senhaAtual: passwordData.senhaAtual,
        novaSenha: passwordData.novaSenha,
      })

      // Reset form
      setPasswordData({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      })

      setPasswordSuccess("Senha alterada com sucesso!")

      
      setTimeout(() => {
        setPasswordSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error changing password:", err)
      setPasswordError(err instanceof Error ? err.message : "Erro ao alterar senha")
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Mostra estado de carregamento enquanto busca os dados do usuário
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="flex items-center transition-colors duration-300 mb-8 group" onClick={() => router.back()}>
        <i className="fa-solid fa-arrow-left mr-2 group-hover:translate-x-[-2px] transition-transform"></i>
        <span className="font-medium">Voltar</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#9D1919] text-white py-4 px-6">
          <h1 className="text-xl font-semibold">Editar Perfil</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6">
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
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-check-circle"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 relative">
                <i className="fa-solid fa-user text-gray-400 text-5xl"></i>
                <div className="absolute bottom-0 right-0 bg-[#9D1919] text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                  <i className="fa-solid fa-camera text-sm"></i>
                </div>
              </div>
              <h2 className="text-lg font-medium text-gray-800">{userData.nome}</h2>
              <p className="text-gray-500 text-sm">{userData.cargo}</p>
            </div>

            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-user text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="nome"
                      value={userData.nome}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-id-card text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="cpf"
                      value={userData.cpf || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-gray-100"
                      disabled={true} // CPF shouldn't be editable
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">O CPF não pode ser alterado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-phone text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="telefone"
                      value={userData.telefone || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-building text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="cargo"
                      value={userData.cargo || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-gray-100"
                      disabled={true} // Cargo shouldn't be editable by user
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">O cargo não pode ser alterado pelo usuário</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-sitemap text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="setor"
                      value={userData.setor || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-gray-100"
                      disabled={true} // Setor shouldn't be editable by user
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">O setor não pode ser alterado pelo usuário</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2 text-sm"></i>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk text-sm mr-2"></i>
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#9D1919] text-white py-4 px-6">
          <h2 className="text-xl font-semibold">Alterar Senha</h2>
        </div>

        {/* Password Error message */}
        {passwordError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">{passwordError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Password Success message */}
        {passwordSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-check-circle"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">{passwordSuccess}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  name="senhaAtual"
                  value={passwordData.senhaAtual}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                  disabled={isChangingPassword}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-key text-gray-400"></i>
                </div>
                <input
                  type="password"
                  name="novaSenha"
                  value={passwordData.novaSenha}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                  minLength={6}
                  disabled={isChangingPassword}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-check-double text-gray-400"></i>
                </div>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={passwordData.confirmarSenha}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                  disabled={isChangingPassword}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow flex items-center"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2 text-sm"></i>
                  Atualizando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-key text-sm mr-2"></i>
                  Atualizar Senha
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
