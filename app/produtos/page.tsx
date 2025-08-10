"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Leaf, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity: number
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory === "all" ? "" : selectedCategory,
        sort: sortBy,
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
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

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-300" />
              <div>
                <h1 className="text-3xl font-bold">GreenLeaf Market</h1>
                <p className="text-green-200">Cannabis Premium</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="hover:text-green-300 transition-colors">
                Início
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Catálogo de Produtos</h2>
          <p className="text-green-700 text-lg">Explore nossa seleção premium de flores e extrações</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price_asc">Menor Preço</SelectItem>
                <SelectItem value="price_desc">Maior Preço</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchProducts} className="bg-green-600 hover:bg-green-700">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-green-200">
                <div className="relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.stock_quantity <= 5 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">Estoque Baixo</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-green-800 line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">Estoque: {product.stock_quantity} unidades</div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            Mostrando {products.length} produto{products.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}
