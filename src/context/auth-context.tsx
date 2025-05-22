"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define user roles for better type safety and readability
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  OPERATOR = "OPERATOR",
}

// Updated User interface to match your backend structure
interface User {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco_id: number
  cargo: string
  setor: string
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean // True if user has admin privileges
  isAuthorized: (allowedRoles: string[]) => boolean // Function to check if user has specific role
  isLoading: boolean // Add this line to include isLoading property
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthorized: () => false,
  isLoading: true, // Add this line with a default value of true
  setUser: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Add this line to create isLoading state
  const router = useRouter()

  // Check if user has admin privileges whenever user changes
  useEffect(() => {
    if (user) {
      // Admin privileges are granted to users with ADMIN or MANAGER roles
      setIsAdmin(user.cargo === UserRole.ADMIN || user.cargo === UserRole.MANAGER)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false) // Add this line to set isLoading to false after checking localStorage
  }, [])

  /**
   * Check if the current user has one of the allowed roles
   * @param allowedRoles - Array of roles that are allowed to access a resource
   * @returns boolean - True if user has one of the allowed roles
   */
  const isAuthorized = (allowedRoles: string[]): boolean => {
    if (!user) return false
    return allowedRoles.includes(user.cargo)
  }

  /**
   * Logout the current user
   * - Clears localStorage
   * - Resets user state
   * - Redirects to login page
   */
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenType")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const value = {
    user,
    isAdmin,
    isAuthorized,
    isLoading, // Add this line to include isLoading in the context value
    setUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
