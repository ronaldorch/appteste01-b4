export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin (simplificado)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.includes("admin-token")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Buscar estatísticas administrativas
    const [
      productsResult,
      ordersResult,
      revenueResult,
      usersResult,
      monthlyRevenueResult,
      pendingOrdersResult,
      lowStockResult,
      recentOrdersResult,
      topProductsResult,
    ] = await Promise.all([
      query("SELECT COUNT(*) as total FROM products"),
      query("SELECT COUNT(*) as total FROM orders"),
      query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'"),
      query("SELECT COUNT(*) as total FROM users"),
      query(`
        SELECT COALESCE(SUM(total_amount), 0) as total 
        FROM orders 
        WHERE status != 'cancelled' 
        AND created_at >= date_trunc('month', CURRENT_DATE)
      `),
      query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'"),
      query("SELECT COUNT(*) as total FROM products WHERE stock_quantity <= 5"),
      query(`
        SELECT id, customer_name, total_amount, status, created_at
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 10
      `),
      query(`
        SELECT 
          p.id, p.name,
          COALESCE(SUM(oi.quantity), 0) as total_sold,
          COALESCE(SUM(oi.total_price), 0) as revenue
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC, revenue DESC
        LIMIT 10
      `),
    ])

    const stats = {
      totalProducts: Number.parseInt(productsResult.rows[0].total),
      totalOrders: Number.parseInt(ordersResult.rows[0].total),
      totalRevenue: Number.parseFloat(revenueResult.rows[0].total),
      totalUsers: Number.parseInt(usersResult.rows[0].total),
      monthlyRevenue: Number.parseFloat(monthlyRevenueResult.rows[0].total),
      pendingOrders: Number.parseInt(pendingOrdersResult.rows[0].total),
      lowStockProducts: Number.parseInt(lowStockResult.rows[0].total),
      recentOrders: recentOrdersResult.rows,
      topProducts: topProductsResult.rows.map((row) => ({
        ...row,
        total_sold: Number.parseInt(row.total_sold),
        revenue: Number.parseFloat(row.revenue),
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erro ao buscar estatísticas admin:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
