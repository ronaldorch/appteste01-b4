"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, Grid, List } from "lucide-react"
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
    { name: "Todos", slug: "" },
    { name: "Eletrônicos", slug: "eletronicos" },
    { name: "Roupas", slug: "roupas" },
    { name: "Casa & Jardim", slug: "casa-jardim" },
    { name: "Esportes", slug: "esportes" },
    { name: "Livros", slug: "livros" },
  ]

  useEffect(() => {
    // Carregar filtros da URL
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.slug ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Faixa de Preço</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Preço mínimo"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      placeholder="Preço máximo"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    />
                    <Button onClick={handlePriceFilter} className="w-full" size="sm">
                      Aplicar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Produtos</h1>
                <p className="text-gray-600">{products.length} produtos encontrados</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-600">Tente ajustar seus filtros de busca</p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {products.map((product) => (
                  <Link key={product.id} href={`/produto/${product.slug}`}>
                    <Card
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`relative bg-gray-100 ${
                          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                        }`}
                      >
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300&text=Produto"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-l-lg"
                        />
                        {product.featured && <Badge className="absolute top-2 left-2 bg-red-500">Destaque</Badge>}
                      </div>
                      <div className="flex-1">
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
