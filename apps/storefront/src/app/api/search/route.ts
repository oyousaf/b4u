import { listProducts } from "@lib/data/products"
import { NextRequest, NextResponse } from "next/server"

const REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "gb"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()

  if (!q) {
    return NextResponse.json({ products: [] })
  }

  const { response } = await listProducts({
    countryCode: REGION,
    queryParams: {
      q,
      limit: 6,
      fields: "id,title,handle,thumbnail,*variants.calculated_price",
    },
  })

  const products = response.products.map((product) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail,
    price: product.variants?.[0]?.calculated_price?.calculated_amount ?? null,
    currency_code: product.variants?.[0]?.calculated_price?.currency_code ?? null,
  }))

  return NextResponse.json({ products })
}
