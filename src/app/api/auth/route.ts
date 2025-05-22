import { type NextRequest, NextResponse } from "next/server"

// Este é um proxy simples para evitar problemas de CORS ao testar localmente
export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL || "http://localhost:8080/api"

  try {
    const body = await request.json()

    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        senha: body.senha,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Falha na autenticação" }, { status: response.status })
    }

    
    const responseObj = NextResponse.json(data)
    responseObj.cookies.set({
      name: "token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 hours (matching the JWT expiry)
      path: "/",
    })

    return responseObj
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
