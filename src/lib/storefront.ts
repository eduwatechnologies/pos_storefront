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

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export const formatMoney = (cents: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format((Number.isFinite(cents) ? cents : 0) / 100)
