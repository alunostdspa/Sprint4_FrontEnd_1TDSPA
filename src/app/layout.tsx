import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"
import Header from "./components/header"
import Footer from "./components/footer"
import { AuthProvider } from "@/context/auth-context"

export const metadata: Metadata = {
  title: "Viamobilidade | Sistema de Incidentes",
  description: "Sistema de registro e acompanhamento de incidentes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <head>
        <Script src="https://kit.fontawesome.com/832759ddef.js"/>
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col text-gray-800 antialiased overflow-x-hidden">
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
        </AuthProvider>
      </body>
    </html>
  )
}

