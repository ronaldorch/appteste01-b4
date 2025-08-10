"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Leaf, Sparkles, Star } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  featured: boolean
  thc_level?: string
  strain_type?: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
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

  const addToCart = async (productId: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        alert("Produto adicionado ao carrinho!")
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-300" />
              <div>
                <h1 className="text-3xl font-bold">GreenLeaf Market</h1>
                <p className="text-green-200">Cannabis Premium</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/produtos" className="hover:text-green-300 transition-colors">
                Catálogo
              </Link>
              <Link href="/login" className="hover:text-green-300 transition-colors">
                Login
              </Link>
              <Button
                variant="outline"
                className="border-green-300 text-green-300 hover:bg-green-300 hover:text-green-800 bg-transparent"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-green-800 mb-6">Cannabis Premium de Alta Qualidade</h2>
            <p className="text-xl text-green-700 mb-8 leading-relaxed">
              Descubra nossa seleção exclusiva de flores e extrações premium. Produtos testados, qualidade garantida.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/produtos">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="/produtos?category=flores">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 bg-transparent"
                >
                  <Leaf className="h-5 w-5 mr-2" />
                  Flores Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-green-800 mb-12">Nossas Categorias</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/produtos?category=flores">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-400">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">Flores Premium</CardTitle>
                  <CardDescription>Buds de cannabis de alta qualidade, strains selecionadas</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/produtos?category=extracoes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-400">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-green-800">Extrações</CardTitle>
                  <CardDescription>Concentrados, óleos e extratos de máxima potência</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-green-800 mb-12">Produtos em Destaque</h3>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow border-green-200">
                  <div className="relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-green-800">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => addToCart(product.id)} className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/produtos">
              <Button
                variant="outline"
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
              >
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-300" />
                <span className="text-xl font-bold">GreenLeaf Market</span>
              </div>
              <p className="text-green-200">Sua fonte confiável para cannabis premium de alta qualidade.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-green-200">
                <li>
                  <Link href="/produtos?category=flores" className="hover:text-white">
                    Flores Premium
                  </Link>
                </li>
                <li>
                  <Link href="/produtos?category=extracoes" className="hover:text-white">
                    Extrações
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-green-200">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Criar Conta
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2024 GreenLeaf Market. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
