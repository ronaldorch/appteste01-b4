"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Leaf, Search, Star, Truck, Shield, Award } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  featured: boolean
  thc_level: string
  strain_type: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=6")
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.products || [])
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/produtos?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  GreenLeaf
                </span>
                <p className="text-xs text-green-600 font-medium">Premium Cannabis</p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <Input
                  placeholder="Buscar strains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <Link href="/produtos" className="text-green-700 hover:text-green-900 font-medium">
                Catálogo
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
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Premium
              </span>
              <br />
              <span className="text-gray-800">Cannabis</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Flores e extrações de alta qualidade. Strains selecionados com os melhores níveis de THC e CBD.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/produtos?category=flores">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8"
              >
                <Leaf className="h-5 w-5 mr-2" />
                Ver Flores
              </Button>
            </Link>
            <Link href="/produtos?category=extracoes">
              <Button
                size="lg"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 text-lg px-8 bg-transparent"
              >
                Extrações Premium
              </Button>
            </Link>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/produtos?category=flores">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-green-200 hover:border-green-300">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🌿</div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                    Flores Premium
                  </h3>
                  <p className="text-gray-600">
                    Buds de alta qualidade, Colombian Gold, Califa Kush e outras strains selecionadas
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/produtos?category=extracoes">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-green-200 hover:border-green-300">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💧</div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                    Extrações
                  </h3>
                  <p className="text-gray-600">Concentrados, óleos e extratos de cannabis com alta potência e pureza</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-600 text-lg">Seleção premium das melhores strains disponíveis</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
                      src={product.image_url || "/placeholder.svg?height=300&width=300&text=🌿"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 text-green-700">
                        {product.thc_level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                        {product.strain_type}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
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
                Ver Todo Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Por que escolher GreenLeaf?</h2>
            <p className="text-green-100 text-lg">Qualidade premium em cada produto</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade Premium</h3>
              <p className="text-green-100">Strains selecionados com os mais altos padrões de qualidade</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-green-100">Entrega discreta e segura em todo o território nacional</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-green-100">Transações seguras e dados protegidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">GreenLeaf</span>
                  <p className="text-xs text-green-400">Premium Cannabis</p>
                </div>
              </div>
              <p className="text-gray-400">Cannabis premium de alta qualidade para conhecedores.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🌿 Flores Premium</li>
                <li>💧 Extrações</li>
                <li>🔥 Concentrados</li>
                <li>🌱 Strains Especiais</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós</li>
                <li>Contato</li>
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>FAQ</li>
                <li>Chat Online</li>
                <li>Rastreamento</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenLeaf - Premium Cannabis Marketplace</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
