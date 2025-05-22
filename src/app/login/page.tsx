"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Perfil() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, user, isAdmin } = useAuth()

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "unauthorized") {
      setError("Você não tem permissão para acessar a área administrativa.")
    }
  }, [searchParams])

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      // If user is admin or manager, redirect to admin dashboard
      if (isAdmin) {
        router.push("/admin")
      } else {
        // For regular users (USER or OPERATOR), redirect to user dashboard
        router.push("/dashboard")
      }
    }
  }, [user, isAdmin, router])

  /**
   * Handle form submission
   * - Validates credentials with the backend
   * - Stores user data and token on successful login
   * - Redirects based on user role
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Direct fetch to your API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      })

      // Parse the response as JSON even if it's an error
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        // If we have a structured error message from the backend
        if (data && typeof data === "object") {
          console.error("Backend error details:", data)
          throw new Error("Erro no servidor. Por favor, contate o administrador.")
        } else {
          throw new Error("Falha na autenticação. Verifique suas credenciais.")
        }
      }

      // Save auth data to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("tokenType", data.tipo)
      localStorage.setItem("user", JSON.stringify(data.usuario))

      // Update user state
      setUser(data.usuario)

      // Redirect will happen in the useEffect based on user role
      console.log("Login successful. User role:", data.usuario.cargo)
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Erro ao tentar fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center p-6 md:p-10 min-h-[calc(100vh-350px)]">
      <div className="w-full max-w-md">
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9D1919]/10 rounded-full mb-4">
              <i className="fa-solid fa-user text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-500 mt-1">Acesse sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="manter-logado"
                checked={keepLoggedIn}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="manter-logado" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Manter-me conectado
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#9D1919] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
