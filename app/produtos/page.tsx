"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, Grid, List, Leaf, Star, Shield } from "lucide-react"
import { useSearchParams } from "next/navigation"

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const searchParams = useSearchParams()

  const categories = [
    { name: "Todos os Produtos", slug: "", icon: "🌿" },
    { name: "Sementes Premium", slug: "sementes", icon: "🌱" },
    { name: "Acessórios", slug: "acessorios", icon: "🔥" },
    { name: "Extratos & Óleos", slug: "extratos", icon: "💧" },
    { name: "Vaporizadores", slug: "vaporizadores", icon: "💨" },
    { name: "Cultivo Indoor", slug: "cultivo", icon: "🏠" },
  ]

  useEffect(() => {
    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""

    setSelectedCategory(category)
    setSearchTerm(search)

    fetchProducts({ category, search })
  }, [searchParams])

  const fetchProducts = async (filters: any = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.category || selectedCategory) {
        params.append("category", filters.category || selectedCategory)
      }
      if (filters.search || searchTerm) {
        params.append("search", filters.search || searchTerm)
      }
      if (priceRange.min) {
        params.append("minPrice", priceRange.min)
      }
      if (priceRange.max) {
        params.append("maxPrice", priceRange.max)
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts({ search: searchTerm })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    fetchProducts({ category })
  }

  const handlePriceFilter = () => {
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-green-700 font-medium">Carregando produtos premium...</p>
        </div>
      </div>
    )
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
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-amber-100 border-l-4 border-amber-500 p-3">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-amber-600 mr-2" />
            <p className="text-amber-800 text-sm font-medium">
              🎮 Marketplace fictício para jogos - Nenhum produto real é vendido
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <Card className="border-green-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Filter className="w-5 h-5" />
                  Filtros Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3 text-green-800">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.slug
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "hover:bg-green-50 text-gray-700"
                        }`}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3 text-green-800">Faixa de Preço</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Preço mínimo"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Input
                      placeholder="Preço máximo"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Button
                      onClick={handlePriceFilter}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="sm"
                    >
                      Aplicar Filtro
                    </Button>
                  </div>
                </div>

                {/* Quality Badge */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Qualidade Premium</span>
                  </div>
                  <p className="text-sm text-green-700">Todos os produtos passam por rigoroso controle de qualidade</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Produtos Premium
                </h1>
                <p className="text-green-700">{products.length} produtos encontrados</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <Card className="border-green-100">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-600 mb-4">Tente ajustar seus filtros de busca</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("")
                      setSearchTerm("")
                      setPriceRange({ min: "", max: "" })
                      fetchProducts({})
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Ver Todos os Produtos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {products.map((product) => (
                  <Link key={product.id} href={`/produto/${product.slug}`}>
                    <Card
                      className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`relative bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden ${
                          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                        }`}
                      >
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300&text=🌿+Cannabis"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <div className="flex-1">
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
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
