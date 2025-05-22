"use client"

import { useAuth } from "@/context/auth-context"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const { logout } = useAuth()

  return (
    <button
      onClick={logout}
      className={`bg-[#9D1919] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#8A1515] ${className}`}
    >
      <i className="fa-solid fa-sign-out-alt mr-2"></i>
      Sair
    </button>
  )
}
