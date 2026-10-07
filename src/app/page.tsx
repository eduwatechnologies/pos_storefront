'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [shopId, setShopId] = useState('')

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Kounter storefront</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Open a shop storefront</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the shop ID or slug from your POS backend to view the public storefront and place an order.
        </p>

        <div className="mt-8 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Shop reference</label>
          <input
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            placeholder="Enter shop ID"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-0"
          />
          <Button
            className="w-full"
            onClick={() => {
              const target = shopId.trim()
              if (!target) return
              router.push(`/store/${encodeURIComponent(target)}`)
            }}
          >
            Open storefront
          </Button>
        </div>
      </div>
    </main>
  )
}
