export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getPublicProducts } from "@/lib/marketplace"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined,
      featured: searchParams.get("featured") === "true" || undefined,
    }

    const products = await getPublicProducts(filters)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
