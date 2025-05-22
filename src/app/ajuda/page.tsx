export default function Ajuda() {
    // FAQ data
    const faqs = [
      {
        question: "Como registrar um incidente?",
        answer:
          "Para registrar um incidente, acesse a página inicial e clique no botão 'Registro de Incidente'. Selecione o tipo de incidente e preencha o formulário com as informações necessárias.",
      },
      {
        question: "Como acompanhar o status de um incidente?",
        answer:
          "Você pode acompanhar o status de um incidente acessando a página 'Histórico'. Lá você encontrará todos os incidentes registrados e seus respectivos status.",
      },
      {
        question: "Posso anexar fotos ao registrar um incidente?",
        answer:
          "Sim, ao preencher o formulário de registro de incidente, você encontrará uma opção para anexar imagens que ajudem a identificar o problema.",
      },
      {
        question: "Como recebo notificações sobre os incidentes?",
        answer:
          "As notificações são enviadas automaticamente para o seu e-mail cadastrado. Você também pode visualizá-las na página 'Notificações' do sistema.",
      },
      {
        question: "Esqueci minha senha, como recuperá-la?",
        answer:
          "Na página de login, clique em 'Esqueceu sua senha?' e siga as instruções para redefinir sua senha através do e-mail cadastrado.",
      },
    ]
  
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <i className="fa-solid fa-circle-question text-2xl mr-3"></i>
          <h1 className="text-3xl font-bold text-gray-800">Central de Ajuda</h1>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col items-center text-center">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-file-lines text-xl"></i>
            </div>
            <h2 className="text-lg font-semibold mb-2">Documentação</h2>
            <p className="text-gray-600 text-sm">Acesse nossos manuais e guias para utilizar o sistema</p>
          </div>
  
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col items-center text-center">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-phone text-xl"></i>
            </div>
            <h2 className="text-lg font-semibold mb-2">Suporte Telefônico</h2>
            <p className="text-gray-600 text-sm">0800 123 4567</p>
            <p className="text-gray-600 text-sm">Segunda a sexta, 8h às 18h</p>
          </div>
  
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col items-center text-center">
            <div className="bg-[#9D1919]/10 p-4 rounded-full mb-4">
              <i className="fa-solid fa-envelope text-xl"></i>
            </div>
            <h2 className="text-lg font-semibold mb-2">E-mail</h2>
            <p className="text-gray-600 text-sm">suporte@viamobilidade.com.br</p>
            <p className="text-gray-600 text-sm">Resposta em até 24h úteis</p>
          </div>
        </div>
  
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#9D1919] text-white py-4 px-6">
            <h2 className="text-xl font-semibold">Perguntas Frequentes</h2>
          </div>
  
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-start">
                  <span className="mr-2">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  