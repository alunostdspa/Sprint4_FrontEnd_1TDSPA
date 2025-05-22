"use client"

import { useAuth } from "@/context/auth-context"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

/**
 * Componente para renderizar conteúdo condicionalmente baseado no papel do usuário
 * @param children - Conteúdo a ser exibido se o usuário tiver o papel requerido
 * @param allowedRoles - Array de papéis autorizados a ver o conteúdo
 * @param fallback - Conteúdo opcional a ser exibido se o usuário não tiver o papel requerido
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { isAuthorized } = useAuth()

  if (isAuthorized(allowedRoles)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
