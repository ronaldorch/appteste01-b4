"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, Star, TrendingUp, Package, Users } from "lucide-react"

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
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories] = useState<Category[]>([
    { id: 1, name: "Eletrônicos", slug: "eletronicos" },
    { id: 2, name: "Roupas", slug: "roupas" },
    { id: 3, name: "Casa & Jardim", slug: "casa-jardim" },
    { id: 4, name: "Esportes", slug: "esportes" },
    { id: 5, name: "Livros", slug: "livros" },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              MarketPlace
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <Link href="/carrinho">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Encontre Tudo o Que Você Precisa</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Milhares de produtos com os melhores preços e entrega rápida. Sua experiência de compra nunca foi tão fácil!
          </p>
          <Link href="/produtos">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explorar Produtos
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">10.000+</h3>
              <p className="text-gray-600">Produtos</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">50.000+</h3>
              <p className="text-gray-600">Clientes</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">98%</h3>
              <p className="text-gray-600">Satisfação</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
              <p className="text-gray-600">Avaliação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/produtos?category=${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
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
            <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
            <Link href="/produtos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/produto/${product.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=300&text=Produto"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    {product.featured && <Badge className="absolute top-2 left-2 bg-red-500">Destaque</Badge>}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <Badge variant="outline">{product.category_name}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Vendido por {product.seller_name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MarketPlace</h3>
              <p className="text-gray-400">Sua plataforma de compras online com os melhores produtos e preços.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/produtos?category=${category.slug}`} className="hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conta</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Criar Conta
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Vender
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MarketPlace. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
