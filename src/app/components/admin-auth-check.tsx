"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserRole } from "@/context/auth-context"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthorized, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only check after loading is complete
    if (!isLoading && !isAuthorized([UserRole.ADMIN, UserRole.MANAGER])) {
      router.push("/login?error=unauthorized")
    }
  }, [isAuthorized, isLoading, router])

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D1919]"></div>
      </div>
    )
  }

  return <>{children}</>
}
