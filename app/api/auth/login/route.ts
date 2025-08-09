import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados de usuários
const users = [
  {
    id: 1,
    name: "Usuário Demo",
    email: "demo@exemplo.com",
    password: "123456", // Em produção, use hash da senha
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

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
