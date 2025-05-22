"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()

  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith("/admin")

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      {/* barra de cima */}
      <div className="bg-[#9D1919]  text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            {/* Lado direito */}
            <div className="flex items-center ml-auto">
              <div className="relative ml-2">
                <button
                  className="p-2 text-white hover:text-gray-200 transition-colors duration-200 relative"
                  aria-label="Notificações"
                >
                  <i className="fa-solid fa-bell text-sm"></i>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                </button>
              </div>

              <div className="relative ml-2">
                <button
                  className="flex items-center text-white hover:text-gray-200 transition-colors duration-200 p-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Menu do usuário"
                >
                  {user ? (
                    <>
                      <span className="text-sm font-medium hidden sm:inline mr-1">{user.nome}</span>
                      <i className="fa-solid fa-chevron-down text-xs ml-1"></i>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user text-sm mr-1"></i>
                      <span className="text-sm font-medium hidden sm:inline">Login</span>
                      <i className="fa-solid fa-chevron-down text-xs ml-1"></i>
                    </>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-700">{user.nome}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/editar-conta"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Editar conta
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Painel Admin
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          href="/ajuda"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Ajuda
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Entrar
                        </Link>
                        <Link
                          href="/editar-conta"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Editar conta
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          href="/ajuda"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Ajuda
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Container */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? "h-[90px]" : "h-[120px] md:h-[150px]"}`}>
        <div className="container mx-auto h-full flex items-center justify-center">
          <Link href={isAdminPage ? "/admin" : "/"} className="transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <Image
                src="/imagens/logo_viamobilidade.png"
                alt="Logo Viamobilidade"
                width={500}
                height={100}
                className={`object-contain transition-all duration-300 ${isScrolled ? "w-[180px] md:w-[220px]" : "w-[200px] md:w-[300px]"}`}
                priority
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-[#9D1919] shadow-md hidden md:block">
        <div className="container mx-auto">
          {isAdminPage ? (
            <ul className="flex justify-center gap-1 py-0 text-lg list-none">
              <li className="relative">
                <Link
                  href="/admin"
                  className={`block px-5 py-4 text-white hover:text-gray-200 transition-colors duration-300 font-medium ${
                    pathname === "/admin" ? "bg-primary-hover" : ""
                  }`}
                >
                  Dashboard
                  {pathname === "/admin" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white mx-5"></span>
                  )}
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/admin/incidentes"
                  className={`block px-5 py-4 text-white hover:text-gray-200 transition-colors duration-300 font-medium ${
                    pathname === "/admin/incidentes" ? "bg-primary-hover" : ""
                  }`}
                >
                  Incidentes
                  {pathname === "/admin/incidentes" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white mx-5"></span>
                  )}
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/"
                  className="block px-5 py-4 text-white hover:text-gray-200 transition-colors duration-300 font-medium"
                >
                  Voltar ao Site
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex justify-center gap-1 py-0 text-lg list-none">
              {[
                { name: "Home", path: "/" },
                { name: "Registro", path: "/selecao-incidente" },
                { name: "Notificações", path: "/notificacao" },
                { name: "Histórico", path: "/historico" },
                { name: "Sobre", path: "/integrantes" },
              ].map((item) => (
                <li key={item.path} className="relative">
                  <Link
                    href={item.path}
                    className={`block px-5 py-4 text-white hover:text-gray-200 transition-colors duration-300 font-medium ${
                      pathname === item.path ? "bg-primary-hover" : ""
                    }`}
                  >
                    {item.name}
                    {/* indicador de pagina ativa */}
                    {pathname === item.path && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white mx-5"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="bg-[#9D1919] md:hidden flex justify-between items-center px-4 py-3 shadow-md">
        <span className="text-white font-medium">Menu</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? (
            <i className="fa-solid fa-xmark text-xl"></i>
          ) : (
            <i className="fa-solid fa-bars text-xl"></i>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-lg md:hidden fixed inset-0 z-50 pt-[56px]">
          <div className="h-full overflow-y-auto">
            {user && (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9D1919]/10 flex items-center justify-center">
                    <i className="fa-solid fa-user "></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user.nome}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <ul className="flex flex-col py-2">
              {isAdminPage ? (
                <>
                  <li>
                    <Link
                      href="/admin"
                      className={`flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                        pathname === "/admin" ? "bg-gray-100 border-l-4 " : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-gauge-high w-6 "></i>
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/incidentes"
                      className={`flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                        pathname === "/admin/incidentes" ? "bg-gray-100 border-l-4 " : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-clipboard-list w-6 "></i>
                      <span className="ml-3">Incidentes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/equipes"
                      className={`flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                        pathname === "/admin/equipes" ? "bg-gray-100 border-l-4 " : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-users w-6 "></i>
                      <span className="ml-3">Equipes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/configuracoes"
                      className={`flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                        pathname === "/admin/configuracoes" ? "bg-gray-100 border-l-4 " : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-gear w-6 "></i>
                      <span className="ml-3">Configurações</span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href="/"
                      className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-arrow-left w-6 "></i>
                      <span className="ml-3">Voltar ao Site</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {[
                    { name: "Home", path: "/", icon: "fa-home" },
                    { name: "Registro", path: "/selecao-incidente", icon: "fa-pen-to-square" },
                    { name: "Notificações", path: "/notificacao", icon: "fa-bell" },
                    { name: "Histórico", path: "/historico", icon: "fa-history" },
                    { name: "Sobre", path: "/integrantes", icon: "fa-users" },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                          pathname === item.path ? "bg-gray-100 border-l-4 " : ""
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className={`fa-solid ${item.icon} w-6 `}></i>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-gray-200 mt-2 pt-2">
                    {user ? (
                      <>
                        <Link
                          href="/editar-conta"
                          className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="fa-solid fa-user-pen w-6 "></i>
                          <span className="ml-3">Editar Conta</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <i className="fa-solid fa-user-shield w-6 "></i>
                            <span className="ml-3">Painel Admin</span>
                          </Link>
                        )}
                        <Link
                          href="/ajuda"
                          className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="fa-solid fa-circle-question w-6 "></i>
                          <span className="ml-3">Ajuda</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setMobileMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-4 text-red-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <i className="fa-solid fa-right-from-bracket w-6"></i>
                          <span className="ml-3">Sair</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="fa-solid fa-user w-6 "></i>
                          <span className="ml-3">Login</span>
                        </Link>
                        <Link
                          href="/editar-conta"
                          className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="fa-solid fa-user-pen w-6 "></i>
                          <span className="ml-3">Editar Conta</span>
                        </Link>
                        <Link
                          href="/ajuda"
                          className="flex items-center px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="fa-solid fa-circle-question w-6 "></i>
                          <span className="ml-3">Ajuda</span>
                        </Link>
                      </>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

