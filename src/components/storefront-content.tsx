'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { API_BASE, formatMoney, normalizeShopReference, type PublicProduct, type PublicShop } from '@/lib/storefront'

type CartItem = {
  productId: string
  name: string
  priceCents: number
  imageUrl?: string | null
  qty: number
}

function ChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
function ShoppingCart({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function StoreIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22V11H9v11" />
      <path d="M2 7h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
    </svg>
  )
}
function TrashIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
function MinusIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
    </svg>
  )
}
function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function MapPinIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function SparklesIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  )
}
function TruckIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}
function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

export function StorefrontContent({ shopReference }: { shopReference: string }) {
  const shopRef = normalizeShopReference(shopReference ?? '')

  const [shop, setShop] = useState<PublicShop | null>(null)
  const [products, setProducts] = useState<PublicProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storefrontDisabled, setStorefrontDisabled] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cartSummaryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!shopRef) {
      setLoading(false)
      setError('Store not found')
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      setStorefrontDisabled(false)
      try {
        const res = await fetch(`${API_BASE}/shops/${shopRef}/storefront`, { method: 'GET' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          if (res.status === 403 && String(data?.error ?? '').toLowerCase().includes('disabled')) {
            setStorefrontDisabled(true)
            setShop(data?.shop ?? null)
          } else {
            throw new Error(data?.error ?? 'Failed to load storefront')
          }
          return
        }
        setShop(data?.shop ?? null)
        setProducts(Array.isArray(data?.products) ? data.products : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load storefront')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [shopRef])

  const categories = useMemo(() => {
    const s = new Set<string>()
    for (const p of products) {
      if (p?.category) s.add(p.category)
    }
    return Array.from(s)
  }, [products])

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (!p.isActive) return false
      if (activeCategory && p.category !== activeCategory) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      )
    })
  }, [products, search, activeCategory])

  const featuredProducts = useMemo(
    () => [...products].filter((p) => p.isActive).sort((a, b) => b.stockQty - a.stockQty).slice(0, 8),
    [products]
  )

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotalCents = cart.reduce((sum, item) => sum + item.priceCents * item.qty, 0)
  const deliveryFeeCents = shop?.storefrontDeliveryFeeCents ?? 0
  const totalCents = subtotalCents + (shop?.storefrontPickupOnly === true ? 0 : deliveryFeeCents)

  const carouselSlides = useMemo(() => {
    const slides: Array<{ title: string; subtitle: string; cta: string; image?: string | null; bg: string }> = []
    if (shop?.storefrontBannerUrl) {
      slides.push({
        title: `${shop.businessName || shop.name}`,
        subtitle: shop.storefrontDescription ?? 'Fresh picks, everyday low prices, delivered fast.',
        cta: 'Shop now',
        image: shop.storefrontBannerUrl,
        bg: shop.storefrontPrimaryColor || '#0f172a',
      })
    }
    slides.push({
      title: featuredProducts.length
        ? 'This week’s top picks'
        : 'Order ahead, skip the wait',
      subtitle: featuredProducts.length
        ? `Handpicked from our best sellers — ${formatMoney(featuredProducts[0].priceCents, shop?.currency)} and up.`
        : 'Place your order online and pick up curbside or get it delivered.',
      cta: featuredProducts.length ? 'Explore best sellers' : 'Browse products',
      image: null,
      bg: shop?.storefrontPrimaryColor || '#0f172a',
    })
    if (!shop?.storefrontPickupOnly) {
      slides.push({
        title: 'Delivery available',
        subtitle: deliveryFeeCents > 0
          ? `Flat delivery fee of ${formatMoney(deliveryFeeCents, shop?.currency)} on every order.`
          : 'Free delivery on every order, no minimum spend.',
        cta: 'Start shopping',
        image: null,
        bg: '#111827',
      })
    }
    return slides
  }, [shop, featuredProducts, deliveryFeeCents])

  useEffect(() => {
    if (carouselSlides.length <= 1) return
    carouselTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)
    }, 5500)
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current)
    }
  }, [carouselSlides.length])

  const addToCart = (product: PublicProduct) => {
    setSuccess(null)
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, qty: Math.min(item.qty + 1, Math.max(product.stockQty, 1)) }
            : item,
        )
      }
      return [...current, { productId: product.id, name: product.name, priceCents: product.priceCents, imageUrl: product.imageUrl, qty: 1 }]
    })
    if (cartSummaryRef.current) {
      cartSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const updateQty = (productId: string, nextQty: number) => {
    setCart((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, qty: Math.max(0, nextQty) } : item))
        .filter((item) => item.qty > 0),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

  const scrollToProducts = () => {
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCheckout = async () => {
    if (!shop || cart.length === 0) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_BASE}/shops/${shopRef}/storefront/orders`, {
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
      setSuccess(`Order placed successfully. Reference: ${data?.orderNumber ?? data?.orderId ?? 'created'}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2 text-slate-700">
              <StoreIcon className="h-5 w-5" />
              <span className="font-semibold">Loading store…</span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-3xl p-8 text-sm text-slate-500">
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
            <span className="ml-3 text-base">Loading storefront…</span>
          </div>
        </div>
      </div>
    )
  }

  if (storefrontDisabled || !shop) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: shop?.storefrontPrimaryColor || '#0f172a' }}
              >
                <StoreIcon className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">
                  {shop?.businessName || shop?.name || 'Storefront'}
                </div>
                <div className="text-[11px] text-slate-500">Online ordering</div>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-3xl p-4 md:p-12">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-md">
            <div
              className="space-y-4 p-10 text-white"
              style={{ background: `linear-gradient(135deg, ${shop?.storefrontPrimaryColor || '#0f172a'} 0%, #111827 100%)` }}
            >
              <p className="text-xs uppercase tracking-[0.26em] opacity-70">Storefront</p>
              <h1 className="text-4xl font-bold leading-tight">
                {shop?.businessName || shop?.name || 'This store is taking a break'}
              </h1>
              {(shop?.storefrontDescription || shop?.address) ? (
                <div className="space-y-1 text-sm opacity-90">
                  {shop?.storefrontDescription ? <p>{shop.storefrontDescription}</p> : null}
                  {shop?.address ? <p className="flex items-center gap-2"><MapPinIcon className="h-4 w-4" />{shop.address}</p> : null}
                </div>
              ) : null}
            </div>
            <CardContent className="space-y-6 p-8">
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <div className="flex-shrink-0 pt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Online ordering is not currently enabled for this store.</p>
                  <p className="text-amber-700">
                    Please check back later or contact the store directly if you need to place an order.
                  </p>
                  {shop?.phone ? (
                    <p className="flex items-center gap-2 text-amber-700">
                      <PhoneIcon className="h-4 w-4" />
                      <span className="font-medium">{shop.phone}</span>
                    </p>
                  ) : null}
                </div>
              </div>
              {error && !storefrontDisabled ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const primaryColor = shop.storefrontPrimaryColor || '#0f172a'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: primaryColor }}
            >
              <StoreIcon className="h-5 w-5" />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{shop.businessName || shop.name}</div>
              <div className="text-[11px] text-slate-500">Shop online · Pay on delivery</div>
            </div>
          </a>

          <div className="relative flex-1 max-w-xl mx-auto hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory(null) }}
              placeholder="Search products, categories…"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <button
            type="button"
            onClick={scrollToProducts}
            className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <MapPinIcon className="h-3.5 w-3.5" />
            {shop.address ? shop.address.split(',')[0] : 'See store address'}
          </button>

          <button
            type="button"
            onClick={() => cartSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ background: primaryColor }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-slate-900 ring-2 ring-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="border-t border-slate-100 bg-white/80 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory(null) }}
                placeholder="Search products…"
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="font-semibold">Order placed ✓</div>
            <div className="mt-0.5">{success}</div>
          </div>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl text-white shadow-lg">
          <div className="relative h-[340px] md:h-[420px]">
            {carouselSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ${idx === carouselIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{
                  background: slide.image
                    ? `linear-gradient(90deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.15) 60%), url(${slide.image}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${slide.bg} 0%, #111827 100%)`,
                }}
              >
                <div className="relative z-10 flex h-full items-center px-6 md:px-14">
                  <div className="max-w-xl space-y-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-white/20">
                      <SparklesIcon className="h-3.5 w-3.5" />
                      {idx === 0 ? 'Welcome' : idx === 1 ? 'Featured' : 'Delivery'}
                    </span>
                    <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">{slide.title}</h2>
                    <p className="max-w-lg text-sm opacity-90 md:text-base">{slide.subtitle}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={scrollToProducts}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
                      >
                        {slide.cta}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      {shop.phone ? (
                        <a
                          href={`tel:${shop.phone}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                        >
                          <PhoneIcon className="h-4 w-4" />
                          Call store
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white backdrop-blur hover:bg-black/40 md:block"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white backdrop-blur hover:bg-black/40 md:block"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {carouselSlides.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === carouselIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: primaryColor }}
            >
              <TruckIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {shop.storefrontPickupOnly ? 'Curbside pickup' : 'Fast delivery'}
              </div>
              <div className="text-xs text-slate-500">
                {shop.storefrontPickupOnly
                  ? 'Pick up your order in-store — no waiting.'
                  : deliveryFeeCents > 0
                    ? `Flat delivery fee ${formatMoney(deliveryFeeCents, shop.currency)}.`
                    : 'Free delivery on all orders.'}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Pay on delivery</div>
              <div className="text-xs text-slate-500">Cash or POS when you receive your order.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Fresh quality</div>
              <div className="text-xs text-slate-500">Directly from the store shelf to your door.</div>
            </div>
          </div>
        </section>

        {categories.length > 0 ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h3 className="text-lg font-bold text-slate-900">Shop by category</h3>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Show all
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  activeCategory === null
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                style={activeCategory === null ? { background: primaryColor } : undefined}
              >
                All products
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                    activeCategory === c
                      ? 'border-transparent text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  style={activeCategory === c ? { background: primaryColor } : undefined}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section id="products-section" className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            {activeCategory === null && !search && featuredProducts.length > 0 ? (
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Featured</h3>
                    <p className="text-xs text-slate-500">Customer favorites this week</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={`feat-${product.id}`}
                      product={product}
                      currency={shop.currency}
                      primaryColor={primaryColor}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeCategory ? <span className="capitalize">{activeCategory}</span> : search ? `Results for “${search}”` : 'All products'}
                  </h3>
                  <p className="text-xs text-slate-500">{visibleProducts.length} item{visibleProducts.length === 1 ? '' : 's'} available</p>
                </div>
              </div>

              {visibleProducts.length === 0 ? (
                <Card className="border-slate-200 bg-white">
                  <CardContent className="space-y-2 p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <SearchIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No products match your filters</p>
                    <p className="text-xs text-slate-500">Try a different search or category.</p>
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setActiveCategory(null) }}
                      className="mt-2 text-xs font-semibold underline underline-offset-2"
                      style={{ color: primaryColor }}
                    >
                      Clear filters
                    </button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={shop.currency}
                      primaryColor={primaryColor}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside ref={cartSummaryRef} className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">Your cart</CardTitle>
                    <CardDescription className="text-[12px]">{cart.length} item{cart.length === 1 ? '' : 's'} · {cartCount} unit{cartCount === 1 ? '' : 's'}</CardDescription>
                  </div>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                    style={{ background: primaryColor }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 px-5 py-5">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
                    <p className="text-xs text-slate-500">Add some products from the store.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <StoreIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-slate-400 hover:text-red-600"
                              aria-label="Remove item"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {formatMoney(item.priceCents, shop.currency)} each
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQty(item.productId, item.qty - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-6 text-center text-xs font-semibold text-slate-700">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.productId, item.qty + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-slate-800">
                              {formatMoney(item.priceCents * item.qty, shop.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-800">{formatMoney(subtotalCents, shop.currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{shop.storefrontPickupOnly ? 'Pickup (no fee)' : 'Delivery fee'}</span>
                    <span className="font-medium text-slate-800">
                      {shop.storefrontPickupOnly ? '—' : formatMoney(deliveryFeeCents, shop.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                    <span>Total</span>
                    <span>{formatMoney(totalCents, shop.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 px-5 py-4">
                <CardTitle className="text-base font-bold text-slate-900">Customer details</CardTitle>
                <CardDescription className="text-[12px]">We’ll use this to confirm your order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-5 py-5">
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
                ) : null}

                <Button
                  className="w-full !h-12 rounded-xl text-sm font-bold shadow-sm hover:opacity-95"
                  style={{ background: primaryColor, borderColor: primaryColor }}
                  onClick={handleCheckout}
                  disabled={submitting || cart.length === 0}
                >
                  {submitting ? 'Placing order…' : cart.length === 0 ? 'Cart is empty' : 'Place order'}
                </Button>
                <p className="text-[11px] text-center text-slate-500">
                  By placing an order you agree to the store’s terms.
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>

        <footer className="mt-20 border-t border-slate-200 py-10">
          <div className="grid gap-8 md:grid-cols-3 text-sm">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                  style={{ background: primaryColor }}
                >
                  <StoreIcon className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900">{shop.businessName || shop.name}</span>
              </div>
              <p className="mt-3 text-slate-500 max-w-sm">
                {shop.storefrontDescription ?? 'Shop online with confidence — delivered or ready for pickup.'}
              </p>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="font-semibold text-slate-900">Contact</div>
              {shop.address ? (
                <p className="flex items-center gap-2 text-slate-500"><MapPinIcon className="h-4 w-4" />{shop.address}</p>
              ) : null}
              {shop.phone ? (
                <p className="flex items-center gap-2 text-slate-500"><PhoneIcon className="h-4 w-4" />{shop.phone}</p>
              ) : null}
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="font-semibold text-slate-900">Service</div>
              <p className="text-slate-500">{shop.storefrontPickupOnly ? 'Curbside pickup available' : 'Delivery & pickup available'}</p>
              <p className="text-slate-500">Payment on delivery / pickup.</p>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} {shop.businessName || shop.name} · Powered by Kounter
          </div>
        </footer>
      </main>
    </div>
  )
}

function ProductCard({
  product,
  currency,
  primaryColor,
  onAdd,
}: {
  product: PublicProduct
  currency: string
  primaryColor: string
  onAdd: (p: PublicProduct) => void
}) {
  const outOfStock = product.stockQty <= 0
  return (
    <Card className="group overflow-hidden border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <StoreIcon className="h-8 w-8" />
          </div>
        )}
        {product.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur">
            {product.category}
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Sold out
          </span>
        ) : product.stockQty <= 5 ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Only {product.stockQty} left
          </span>
        ) : null}
      </div>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 font-bold text-slate-900">{product.name}</h4>
          <span className="shrink-0 text-xs text-slate-400">{product.stockQty} left</span>
        </div>
        <p className="line-clamp-2 text-xs text-slate-500 min-h-[2rem]">
          {product.description ?? 'Fresh, quality product.'}
        </p>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wide">Price</div>
            <div className="text-lg font-extrabold text-slate-900">
              {formatMoney(product.priceCents, currency)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="inline-flex h-10 items-center gap-1 rounded-xl px-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ background: outOfStock ? '#94a3b8' : primaryColor }}
          >
            <PlusIcon className="h-4 w-4" />
            {outOfStock ? 'Sold' : 'Add'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
