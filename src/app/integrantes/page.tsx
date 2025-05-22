import Image from "next/image"


export default function Integrantes() {
  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: "Fernando Nachtigall Tessmann",
      rm: "RM559617 1TDSPR",
      github: "ftessmann",
      linkedin: "/fernando-tessmann-75086bb6",
      image: "/imagens/integrante_F.jpg",
    },
    {
      id: 2,
      name: "Nome: Ruan Nunes Gaspar",
      rm: "RM559567 1TDSPA",
      github: "RuanGaspar-TDSPA",
      linkedin: "/ruan-gaspar-5664a0222",
      image: "/imagens/integrante_RU.jpg",
    },
    {
      id: 3,
      name: "Rodrigo Paes Morales",
      rm: "RM560209 1TDSPA",
      github: "RodrigoPMorales",
      linkedin: "/rodrigo-morales-b26698203",
      image: "/imagens/integrante_RO.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Equipe FutureFix</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={`Foto de ${member.name}`}
                  fill
                  className="object-cover rounded-full border-4 bg-[#9D1919]/10"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h2>

              <div className="flex space-x-4 mt-2">
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600  transition-colors duration-200"
                  aria-label={`GitHub de ${member.name}`}
                >
                  <i className="fa-brands fa-github text-lg"></i>
                </a>
                <a
                  href={`https://linkedin.com/in/${member.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600  transition-colors duration-200"
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <i className="fa-brands fa-linkedin text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

