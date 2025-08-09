import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao Nosso Site</h1>
          <p className="text-xl text-gray-600 mb-8">Uma plataforma simples e segura para gerenciar suas informações</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔒 Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Sistema de autenticação robusto para proteger suas informações</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚡ Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Interface otimizada para uma experiência fluida e responsiva</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📱 Responsivo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Funciona perfeitamente em desktop, tablet e dispositivos móveis</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
