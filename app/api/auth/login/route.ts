// Forçar uso do Node.js runtime (não Edge Runtime)
export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"

// Verificar se deve usar banco de dados ou dados em memória
const USE_DATABASE = process.env.DB_HOST && process.env.DB_HOST !== "localhost"

// Dados em memória para fallback
const users = [
  {
    id: 1,
    name: "Usuário Demo",
    email: "demo@exemplo.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Admin Sistema",
    email: "admin@sistema.com",
    password: "admin123",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    if (USE_DATABASE) {
      // Usar banco de dados
      try {
        const { authenticateUser } = await import("@/lib/auth")
        const result = await authenticateUser(email, password)

        if (!result) {
          return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
        }

        return NextResponse.json({
          message: "Login realizado com sucesso",
          user: result.user,
          token: result.token,
        })
      } catch (dbError) {
        console.error("Erro no banco, usando fallback:", dbError)
        // Continuar com dados em memória se houver erro no banco
      }
    }

    // Usar dados em memória (fallback)
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
