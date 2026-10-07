'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { API_BASE, formatMoney, type PublicProduct, type PublicShop } from '@/lib/storefront'

type CartItem = {
  productId: string
  name: string
  priceCents: number
  qty: number
}

export default function StorefrontPage() {
  const params = useParams<{ shopId: string }>()
  const shopId = params?.shopId ?? ''

  const [shop, setShop] = useState<PublicShop | null>(null)
  const [products, setProducts] = useState<PublicProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!shopId) {
      setLoading(false)
      setError('Store not found')
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/shops/${shopId}/storefront`, { method: 'GET' })
        if (!res.ok) {
          throw new Error((await res.json().catch(() => ({})))?.error ?? 'Failed to load storefront')
        }
        const data = await res.json()
        setShop(data?.shop ?? null)
        setProducts(Array.isArray(data?.products) ? data.products : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load storefront')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [shopId])

  const addToCart = (product: PublicProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, qty: Math.min(item.qty + 1, Math.max(product.stockQty, 1)) }
            : item,
        )
      }
      return [...current, { productId: product.id, name: product.name, priceCents: product.priceCents, qty: 1 }]
    })
  }

  const updateQty = (productId: string, nextQty: number) => {
    setCart((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, qty: Math.max(0, nextQty) } : item))
        .filter((item) => item.qty > 0),
    )
  }

  const subtotalCents = cart.reduce((sum, item) => sum + item.priceCents * item.qty, 0)
  const totalCents = subtotalCents + (shop?.storefrontDeliveryFeeCents ?? 0)

  const handleCheckout = async () => {
    if (!shop || cart.length === 0) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_BASE}/shops/${shopId}/storefront/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || 'Guest Customer',
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          paymentMethod: 'cash',
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            qty: item.qty,
            unitPriceCents: item.priceCents,
          })),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error ?? 'Unable to place order')

      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setSuccess(`Order placed successfully. Reference: ${data?.orderId ?? 'created'}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading storefront…</div>
  }

  if (!shop) {
    return <div className="p-8 text-sm text-red-600">{error ?? 'Storefront not available.'}</div>
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <div
        className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
        style={{ background: shop.storefrontPrimaryColor || '#0f172a', color: '#fff' }}
      >
        {shop.storefrontBannerUrl ? (
          <img src={shop.storefrontBannerUrl} alt={shop.name} className="h-56 w-full object-cover" />
        ) : null}
        <div className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-[0.26em] opacity-80">Storefront</p>
          <h1 className="text-3xl font-bold">{shop.businessName || shop.name}</h1>
          {shop.storefrontDescription ? <p className="max-w-2xl text-sm opacity-90">{shop.storefrontDescription}</p> : null}
          {shop.address ? <p className="text-sm opacity-80">{shop.address}</p> : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
            <span className="text-sm text-slate-500">{products.length} items</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border-slate-200 bg-white">
                <div className="relative h-40 bg-slate-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base text-slate-900">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">{formatMoney(product.priceCents, shop.currency)}</span>
                    <span className="text-xs text-slate-500">{product.stockQty} in stock</span>
                  </div>
                  <p className="text-sm text-slate-600">{product.description ?? 'Freshly stocked product.'}</p>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    Add to cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900">Cart</CardTitle>
              <CardDescription>{cart.length} item(s) selected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-slate-500">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="space-y-2 rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{formatMoney(item.priceCents, shop.currency)}</p>
                      </div>
                      <p className="font-semibold text-slate-900">{formatMoney(item.priceCents * item.qty, shop.currency)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQty(item.productId, item.qty - 1)}>-</Button>
                        <span className="min-w-6 text-center text-sm text-slate-700">{item.qty}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQty(item.productId, item.qty + 1)}>+</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-700">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotalCents, shop.currency)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{formatMoney(shop.storefrontDeliveryFeeCents ?? 0, shop.currency)}</span></div>
                <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>{formatMoney(totalCents, shop.currency)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900">Customer details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              />
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              />
              <input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              />

              <Button className="w-full" onClick={handleCheckout} disabled={submitting || cart.length === 0}>
                {submitting ? 'Placing order…' : 'Place order'}
              </Button>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
