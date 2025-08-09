import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Autenticar usuário
    const result = await authenticateUser(email, password)

    if (!result) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Criar resposta com cookie seguro
    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: result.user,
      token: result.token,
    })

    // Definir cookie HTTP-only para o token
    response.cookies.set("auth-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
