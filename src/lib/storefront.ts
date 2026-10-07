export type PublicShop = {
  id: string
  name: string
  businessName: string
  address: string | null
  phone: string | null
  currency: string
  storefrontEnabled: boolean
  storefrontSlug: string | null
  storefrontDescription: string | null
  storefrontPrimaryColor: string
  storefrontBannerUrl: string | null
  storefrontDeliveryFeeCents: number
  storefrontPickupOnly: boolean
}

export type PublicProduct = {
  id: string
  name: string
  category: string
  description: string | null
  imageUrl: string | null
  priceCents: number
  stockQty: number
  isActive: boolean
}

function normalizeBaseUrl(raw: string) {
  const trimmed = raw.replace(/\/+$/, '')
  if (trimmed.endsWith('/api/v1')) return trimmed
  return `${trimmed}/api/v1`
}

export const API_BASE = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080')

export function normalizeShopReference(input: string) {
  const raw = (input ?? '').trim()
  if (!raw) return ''

  const candidates = [raw]

  try {
    candidates.push(decodeURIComponent(raw))
  } catch {
    // ignore decode errors and keep the original raw value
  }

  for (const candidate of candidates) {
    try {
      const parsed = new URL(candidate)
      const segments = parsed.pathname.split('/').filter(Boolean)
      const storeIndex = segments.lastIndexOf('store')
      const fallbackSegment = segments[segments.length - 1] ?? ''
      const next = storeIndex >= 0 ? segments[storeIndex + 1] ?? fallbackSegment : fallbackSegment
      if (next) return next.trim()
    } catch {
      // fall through to the non-URL path handling below
    }

    const segments = candidate.split(/[/?#]/).filter(Boolean)
    const last = segments[segments.length - 1]
    if (last && last !== 'store') {
      return last.trim()
    }
  }

  return raw
}

export const formatMoney = (cents: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format((Number.isFinite(cents) ? cents : 0) / 100)
