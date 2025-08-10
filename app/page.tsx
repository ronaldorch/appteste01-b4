"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, Star, TrendingUp, Leaf, Users, Shield, Truck } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category_name: string
  slug: string
  featured: boolean
  images: string[]
  seller_name: string
}

interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories] = useState<Category[]>([
    { id: 1, name: "Sementes Premium", slug: "sementes", icon: "🌱" },
    { id: 2, name: "Acessórios", slug: "acessorios", icon: "🔥" },
    { id: 3, name: "Extratos & Óleos", slug: "extratos", icon: "💧" },
    { id: 4, name: "Vaporizadores", slug: "vaporizadores", icon: "💨" },
    { id: 5, name: "Cultivo Indoor", slug: "cultivo", icon: "🏠" },
  ])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true")
      const data = await response.json()
      setFeaturedProducts(data.products || [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/produtos?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  GreenLeaf Market
                </h1>
                <p className="text-xs text-green-600 font-medium">Premium Cannabis Marketplace</p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos premium..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <Link href="/carrinho">
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fillOpacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-16 h-16 text-green-200 mr-4" />
            <div className="text-left">
              <h1 className="text-6xl font-bold mb-2">GreenLeaf Market</h1>
              <p className="text-green-200 text-xl">Marketplace Fictício para Jogos</p>
            </div>
          </div>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore o mundo premium da cannabis em nosso marketplace virtual! 
            Produtos de alta qualidade, genéticas exclusivas e acessórios únicos.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              Conteúdo Fictício
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              Apenas para Jogos
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              100% Virtual
            </Badge>
          </div>
          
          <Link href="/produtos">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold">
              <Leaf className="w-5 h-5 mr-2" />
              Explorar Produtos
            </Button>
          </Link>
        </div>
      </section>

      {/* Warning Banner */}
      <div className="bg-amber-100 border-l-4 border-amber-500 p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-amber-600 mr-3" />
            <p className="text-amber-800 font-medium">
              ⚠️ Este é um marketplace <strong>FICTÍCIO</strong> criado apenas para fins de demonstração e jogos. 
              Nenhum produto real é vendido aqui.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Produtos Premium</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">10.000+</h3>
              <p className="text-gray-600">Cultivadores</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">99%</h3>
              <p className="text-gray-600">Satisfação</p>
            </div>
            <div className="text-center">
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
              <p className="text-gray-600">Avaliação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Categorias Premium</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosamente curada de produtos cannabis de alta qualidade
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/produtos?category=${category.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Produtos em Destaque</h2>
              <p className="text-gray-600">Seleção premium dos nossos melhores produtos</p>
            </div>
            <Link href="/produtos">
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
                Ver Todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/produto/${product.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group">
                  <div className="aspect-square relative bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=300&text=🌿+Cannabis"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        ⭐ Premium
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-green-700">🌿</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {product.category_name}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Por {product.seller_name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">4.9</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Por que escolher GreenLeaf?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Qualidade Garantida</h3>
              <p className="text-green-100">Todos os produtos passam por rigoroso controle de qualidade</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Entrega Discreta</h3>
              <p className="text-green-100">Embalagem discreta e entrega rápida em todo o país</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidade Ativa</h3>
              <p className="text-green-100">Faça parte da maior comunidade de cultivadores do Brasil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GreenLeaf Market</h3>
                  <p className="text-xs text-green-400">Premium Cannabis Marketplace</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Marketplace fictício para demonstração. Nenhum produto real é vendido.
              </p>
              <Badge className="bg-red-100 text-red-800">Apenas para Jogos</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Categorias</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/produtos?category=${category.slug}`} className="hover:text-green-400 transition-colors">
                      {category.icon} {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Conta</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-green-400 transition-colors">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-green-400 transition-colors">
                    Criar Conta
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-green-400 transition-colors">
                    Vender
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className="bg-amber-100 text-amber-800">Conteúdo Fictício</Badge>
              <Badge className="bg-blue-100 text-blue-800">Para Jogos</Badge>
              <Badge className="bg-purple-100 text-purple-800">Não Comercial</Badge>
            </div>
            <p className="text-gray-400">
              &copy; 2024 GreenLeaf Market - Marketplace Fictício. Criado apenas para demonstração e jogos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
