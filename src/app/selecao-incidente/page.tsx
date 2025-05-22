"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SelecaoIncidente() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
        className="flex items-center transition-colors duration-300 mb-8 group"
        onClick={() => router.back()}
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> 
        <span className="font-medium ">Voltar</span>
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">Selecione o Tipo de Incidente</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/registro-incidente-foto" className="transform transition duration-300 hover:scale-[1.02]">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 h-[180px] flex flex-col items-center justify-center border border-gray-100 transition-all duration-300">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-screwdriver-wrench text-3xl "></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Manutenção</h2>
            <p className="text-gray-500 text-sm mt-2">Problemas técnicos e estruturais</p>
          </div>
        </Link>

        <Link href="/registro-incidente" className="transform transition duration-300 hover:scale-[1.02]">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 h-[180px] flex flex-col items-center justify-center border border-gray-100 transition-all duration-300">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-shield-halved text-3xl "></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Segurança</h2>
            <p className="text-gray-500 text-sm mt-2">Ocorrências de segurança</p>
          </div>
        </Link>

        <Link href="/registro-incidente" className="transform transition duration-300 hover:scale-[1.02]">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 h-[180px] flex flex-col items-center justify-center border border-gray-100 transition-all duration-300">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-truck-medical text-3xl "></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Socorro</h2>
            <p className="text-gray-500 text-sm mt-2">Emergências médicas</p>
          </div>
        </Link>

        <Link href="/registro-incidente" className="transform transition duration-300 hover:scale-[1.02]">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 h-[180px] flex flex-col items-center justify-center border border-gray-100 transition-all duration-300">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-train text-3xl "></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Condutor</h2>
            <p className="text-gray-500 text-sm mt-2">Problemas relacionados à condução</p>
          </div>
        </Link>
      </section>
    </div>
  )
}

