"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Leaf, Sparkles, Shield, Award, Users } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  category: string
  featured: boolean
}

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalUsers: number
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar produtos em destaque
        const productsRes = await fetch("/api/products?featured=true&limit=6")
        if (productsRes.ok) {
          const products = await productsRes.json()
          setFeaturedProducts(products)
        }

        // Buscar estatísticas
        const statsRes = await fetch("/api/dashboard/stats")
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header de Aviso Fictício */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Shield className="h-4 w-4" />🎮 MARKETPLACE FICTÍCIO - APENAS PARA DEMONSTRAÇÃO/JOGOS - NENHUM PRODUTO REAL
          <Shield className="h-4 w-4" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                GreenLeaf Market
              </span>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                🎮 Fictício
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/produtos" className="text-green-700 hover:text-green-900 font-medium">
                Produtos
              </Link>
              <Link href="/dashboard" className="text-green-700 hover:text-green-900 font-medium">
                Dashboard
              </Link>
              <Link href="/login" className="text-green-700 hover:text-green-900 font-medium">
                Login
              </Link>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">
              🌿 Premium Cannabis Marketplace (Fictício)
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GreenLeaf
            </span>
            <br />
            <span className="text-gray-800">Market</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            O marketplace premium de cannabis mais completo do Brasil. Sementes, acessórios, extratos e equipamentos de
            cultivo.
          </p>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-red-800 font-medium">
              ⚠️ AVISO: Este é um marketplace FICTÍCIO criado apenas para demonstração e jogos. Nenhum produto real é
              vendido aqui.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produtos">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8"
              >
                <Leaf className="h-5 w-5 mr-2" />
                Explorar Produtos
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 text-lg px-8 bg-transparent"
              >
                <Award className="h-5 w-5 mr-2" />
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalProducts}</div>
                <div className="text-gray-600">Produtos</div>
              </CardContent>
            </Card>
            <Card className="text-center border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalOrders}</div>
                <div className="text-gray-600">Pedidos</div>
              </CardContent>
            </Card>
            <Card className="text-center border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-600 mb-2">R$ {stats.totalRevenue.toFixed(2)}</div>
                <div className="text-gray-600">Faturamento</div>
              </CardContent>
            </Card>
            <Card className="text-center border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalUsers}</div>
                <div className="text-gray-600">Usuários</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-600 text-lg">Seleção premium de produtos de cannabis fictícios</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 border-green-200 hover:border-green-300"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 text-gray-700">
                        🎮 Fictício
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/produtos">
              <Button
                size="lg"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o GreenLeaf?</h2>
            <p className="text-green-100 text-lg">Marketplace fictício com as melhores funcionalidades</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Produtos Premium</h3>
              <p className="text-green-100">Seleção curada dos melhores produtos fictícios de cannabis</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-green-100">Marketplace fictício, seguro para demonstrações e jogos</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
              <p className="text-green-100">Conecte-se com outros entusiastas em nosso ambiente fictício</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold">GreenLeaf Market</span>
              </div>
              <p className="text-gray-400 mb-4">Marketplace fictício de cannabis para demonstração e jogos.</p>
              <div className="bg-red-900/50 border border-red-700 rounded p-3">
                <p className="text-red-300 text-sm font-medium">⚠️ CONTEÚDO FICTÍCIO</p>
                <p className="text-red-400 text-xs">Criado apenas para fins educacionais e de demonstração</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🌱 Sementes Premium</li>
                <li>🔥 Acessórios</li>
                <li>💧 Extratos & Óleos</li>
                <li>💨 Vaporizadores</li>
                <li>🏠 Cultivo Indoor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós (Fictício)</li>
                <li>Contato (Demo)</li>
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>FAQ</li>
                <li>Chat Online (Demo)</li>
                <li>Documentação</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenLeaf Market - Marketplace Fictício para Demonstração</p>
            <p className="text-sm mt-2">
              🎮 Este é um projeto fictício criado apenas para fins educacionais e de demonstração
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
