"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut, Leaf, ShoppingCart, Plus, TrendingUp, DollarSign, Users, Package } from "lucide-react"
import Link from "next/link"

interface UserData {
  name: string
  email: string
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Carregar estatísticas reais
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          "x-user-id": "1", // Simular usuário logado
        },
      })
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-green-700 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    GreenLeaf Dashboard
                  </h1>
                  <Badge className="bg-green-100 text-green-800">🌿 Vendedor Premium</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="border-2 border-green-200">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-amber-100 border-l-4 border-amber-500 p-3">
        <div className="container mx-auto">
          <p className="text-amber-800 text-sm font-medium">
            🎮 Dashboard fictício para demonstração - Marketplace de cannabis virtual para jogos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name.split(" ")[0]}! 🌿</h2>
          <p className="text-gray-600 text-lg">
            Gerencie sua loja de cannabis premium e acompanhe suas vendas em tempo real.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/products/new">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Adicionar Produto
                  </h3>
                  <p className="text-sm text-gray-600">Cadastre um novo produto premium</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/orders">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-emerald-100 p-3 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    Ver Pedidos
                  </h3>
                  <p className="text-sm text-gray-600">Gerencie seus pedidos</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/products">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-teal-100 p-3 rounded-full group-hover:bg-teal-200 transition-colors">
                  <Package className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    Meus Produtos
                  </h3>
                  <p className="text-sm text-gray-600">Visualizar catálogo completo</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-sm font-medium text-green-800">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.totalProducts}</div>
              <p className="text-xs text-green-600">produtos premium ativos</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="text-sm font-medium text-emerald-800">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{stats.totalOrders}</div>
              <p className="text-xs text-emerald-600">pedidos processados</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="text-sm font-medium text-teal-800">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">
                R$ {stats.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-teal-600">faturamento total</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-lime-50 to-green-50">
              <CardTitle className="text-sm font-medium text-lime-800">Clientes</CardTitle>
              <Users className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-700">{stats.totalCustomers}</div>
              <p className="text-xs text-lime-600">clientes únicos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-green-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <TrendingUp className="w-5 h-5" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription className="text-green-600">
                Seus produtos cannabis com melhor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🌱</span>
                    </div>
                    <div>
                      <p className="font-medium">White Widow Feminizada</p>
                      <p className="text-sm text-gray-500">23 vendas</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">R$ 89,90</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💨</span>
                    </div>
                    <div>
                      <p className="font-medium">Vaporesso XMAX V3</p>
                      <p className="text-sm text-gray-500">18 vendas</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">R$ 399,90</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💧</span>
                    </div>
                    <div>
                      <p className="font-medium">Óleo CBD 10%</p>
                      <p className="text-sm text-gray-500">15 vendas</p>
                    </div>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800">R$ 299,90</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="text-emerald-800">Pedidos Recentes</CardTitle>
              <CardDescription className="text-emerald-600">Últimos pedidos de cannabis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#001234</p>
                    <p className="text-sm text-gray-500">João Silva - há 2 horas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 299,90</p>
                    <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#001233</p>
                    <p className="text-sm text-gray-500">Maria Santos - há 4 horas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 159,80</p>
                    <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#001232</p>
                    <p className="text-sm text-gray-500">Pedro Costa - há 1 dia</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 89,90</p>
                    <Badge className="bg-blue-100 text-blue-800">Enviado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
