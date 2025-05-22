import Link from "next/link"

export default function Home() {
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Sistema de Registro de Incidentes
      </h1>

      <div className=" flex flex-col items-center">
      <div className="w-full max-w-3xl mb-12">
          <Link href="/selecao-incidente" className="block w-full transform transition duration-300 hover:scale-[1.02]">
            <button className="w-full h-[180px] md:h-[200px] bg-gradient-to-r bg-[#9D1919] text-white rounded-2xl border-none p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3">
              <i className="fa-solid fa-pen-to-square text-3xl mb-2"></i>
              <span className="text-3xl md:text-4xl font-semibold">Registro de Incidente</span>
              <div className="flex items-center mt-2 text-white/80">
                <span className="text-sm">Clique para registrar</span>
                <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
              </div>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Link href="/historico" className="transform transition duration-300 hover:scale-[1.02]">
            <button className="w-full h-[160px] bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center">
              <i className="fas fa-history text-2xl mb-3"></i>
              <span className="text-xl font-medium">Histórico de Incidentes</span>
            </button>
          </Link>

          <Link href="/notificacao" className="transform transition duration-300 hover:scale-[1.02]">
            <button className="w-full h-[160px] bg-white  rounded-xl border border-gray-200 shadow-md hover:shadow-lg p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center">
              <i className="fas fa-bell text-2xl mb-3"></i>
              <span className="text-xl font-medium">Notificações</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

