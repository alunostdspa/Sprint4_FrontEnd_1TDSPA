import type React from "react"
import AdminAuthCheck from "@/app/components/admin-auth-check"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthCheck>{children}</AdminAuthCheck>
}

