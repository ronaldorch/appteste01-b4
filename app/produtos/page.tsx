"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Filter, Leaf, Star, Grid, List } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
  category: string
  featured: boolean
  slug: string
  thc_level: string
  cbd_level: string
  strain_type: string
  effects: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedStrainType, setSelectedStrainType] = useState<string>("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const searchParams = useSearchParams()

  const categories = [
    { name: "Todas", value: "" },
    { name: "Flores", value: "flores" },
    { name: "Extrações", value: "extracoes" },
  ]

  const strainTypes = [
    { name: "Todos", value: "" },
    { name: "Indica", value: "indica" },
    { name: "Sativa", value: "sativa" },
    { name: "Híbrida", value: "hibrida" },
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
      if (selectedStrainType) {
        params.append("strain_type", selectedStrainType)
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

  const handleStrainTypeChange = (strainType: string) => {
    setSelectedStrainType(strainType)
    fetchProducts()
  }

  const handlePriceFilter = () => {
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-green-700 font-medium">Carregando produtos...</p>
        </div>
      </div>
    )
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
              <Link href="/" className="text-green-700 hover:text-green-900 font-medium">
                Home
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <Card className="border-green-100 shadow-lg">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-t-lg">
                <h3 className="font-bold text-green-800 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-800">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.value
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "hover:bg-green-50 text-gray-700"
                        }`}
                      >
                        <span>{category.value === "flores" ? "🌿" : category.value === "extracoes" ? "💧" : "🔍"}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strain Types */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-800">Tipo de Strain</h4>
                  <div className="space-y-2">
                    {strainTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleStrainTypeChange(type.value)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedStrainType === type.value
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "hover:bg-green-50 text-gray-700"
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-800">Faixa de Preço</h4>
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
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Catálogo Premium
                </h1>
                <p className="text-green-700">{products.length} produtos disponíveis</p>
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
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-600 mb-4">Tente ajustar seus filtros de busca</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("")
                      setSelectedStrainType("")
                      setSearchTerm("")
                      setPriceRange({ min: "", max: "" })
                      fetchProducts({})
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Ver Todos os Produtos
                  </Button>
                </div>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden ${
                        viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                      }`}
                    >
                      <img
                        src={product.image_url || "/placeholder.svg?height=300&width=300&text=🌿"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                          <Badge className="bg-green-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-white/90 text-green-700">
                          {product.thc_level}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/90 text-gray-700">
                          {product.strain_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                          {product.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                      {/* THC/CBD Levels */}
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          THC: {product.thc_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          CBD: {product.cbd_level}
                        </Badge>
                      </div>

                      {/* Effects */}
                      {product.effects && product.effects.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Efeitos:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.effects.slice(0, 3).map((effect, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          disabled={product.stock_quantity === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {product.stock_quantity === 0 ? "Esgotado" : "Adicionar"}
                        </Button>
                      </div>

                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <p className="text-xs text-orange-600 mt-2">
                          Apenas {product.stock_quantity} unidades restantes!
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
