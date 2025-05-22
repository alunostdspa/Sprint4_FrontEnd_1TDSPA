import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const apiUrl = process.env.API_URL || "http://localhost:8080/api"
  const userId = params.id

  try {
    const body = await request.json()
    const { senhaAtual, novaSenha } = body

    
    const userEmail = request.headers.get("X-User-Email")

    if (!userEmail) {
      return NextResponse.json({ message: "Email do usuário não fornecido" }, { status: 400 })
    }

    // Tenta autenticar com a senha atual
    const authResponse = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        senha: senhaAtual,
      }),
    })

    if (!authResponse.ok) {
      return NextResponse.json({ message: "Senha atual incorreta" }, { status: 401 })
    }

    // Se a autenticação for bem-sucedida, obtém o usuário
    const userResponse = await fetch(`${apiUrl}/usuarios/${userId}`, {
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    const userData = await userResponse.json()

    // Atualiza o usuário com a nova senha
    userData.senha = novaSenha

    const updateResponse = await fetch(`${apiUrl}/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(userData),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      return NextResponse.json({ message: `Erro ao atualizar senha: ${errorText}` }, { status: updateResponse.status })
    }

    return NextResponse.json({ message: "Senha atualizada com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
