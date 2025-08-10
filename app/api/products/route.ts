export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const strainType = searchParams.get("strain_type")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let queryText = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock_quantity, 
        p.slug, p.featured,
        c.name as category,
        COALESCE(pi.image_url, '/placeholder.svg?height=300&width=300&text=🌿') as image_url,
        '20-25%' as thc_level,
        '1-3%' as cbd_level,
        CASE 
          WHEN p.name LIKE '%Sativa%' OR p.name LIKE '%Green Crack%' OR p.name LIKE '%Sour Diesel%' OR p.name LIKE '%Colombian%' THEN 'Sativa'
          WHEN p.name LIKE '%Indica%' OR p.name LIKE '%Kush%' OR p.name LIKE '%Purple%' THEN 'Indica'
          ELSE 'Híbrida'
        END as strain_type,
        ARRAY['Relaxante', 'Eufórico', 'Criativo'] as effects
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.stock_quantity > 0
    `

    const params: any[] = []
    let paramCount = 1

    if (category) {
      queryText += ` AND c.slug = $${paramCount}`
      params.push(category)
      paramCount++
    }

    if (search) {
      queryText += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    if (featured === "true") {
      queryText += ` AND p.featured = true`
    }

    if (strainType) {
      queryText += ` AND (
        (p.name LIKE '%Sativa%' OR p.name LIKE '%Green Crack%' OR p.name LIKE '%Sour Diesel%' OR p.name LIKE '%Colombian%') AND $${paramCount} = 'Sativa'
        OR (p.name LIKE '%Indica%' OR p.name LIKE '%Kush%' OR p.name LIKE '%Purple%') AND $${paramCount} = 'Indica'
        OR $${paramCount} = 'Híbrida'
      )`
      params.push(strainType)
      paramCount++
    }

    if (minPrice) {
      queryText += ` AND p.price >= $${paramCount}`
      params.push(Number.parseFloat(minPrice))
      paramCount++
    }

    if (maxPrice) {
      queryText += ` AND p.price <= $${paramCount}`
      params.push(Number.parseFloat(maxPrice))
      paramCount++
    }

    queryText += ` ORDER BY p.featured DESC, p.created_at DESC`

    if (limit) {
      queryText += ` LIMIT $${paramCount}`
      params.push(Number.parseInt(limit))
    }

    const result = await query(queryText, params)

    const products = result.rows.map((row) => ({
      ...row,
      effects: Array.isArray(row.effects) ? row.effects : ["Relaxante", "Eufórico", "Criativo"],
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
