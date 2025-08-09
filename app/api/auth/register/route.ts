import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados de usuários
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
    const { name, email, password } = await request.json()

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar se o usuário já existe
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 })
    }

    // Criar novo usuário
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // Em produção, use hash da senha
    }

    users.push(newUser)

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
