// Forçar uso do Node.js runtime
export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"

const USE_DATABASE = process.env.DB_HOST && process.env.DB_HOST !== "localhost"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    if (USE_DATABASE) {
      try {
        const { createUser, findUserByEmail } = await import("@/lib/auth")

        const existingUser = await findUserByEmail(email)
        if (existingUser) {
          return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 })
        }

        const newUser = await createUser(name, email, password)
        if (!newUser) {
          return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
        }

        return NextResponse.json({
          message: "Usuário criado com sucesso",
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
        })
      } catch (dbError) {
        console.error("Erro no banco:", dbError)
        return NextResponse.json({ error: "Erro no banco de dados" }, { status: 500 })
      }
    }

    // Fallback: simular criação (dados em memória)
    return NextResponse.json({
      message: "Usuário criado com sucesso (modo demo)",
      user: { id: Date.now(), name, email },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
