'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { StorefrontContent } from '@/components/storefront-content'

export default function StorefrontPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading storefront…</div>}>
      <StorefrontByShopId />
    </Suspense>
  )
}

function StorefrontByShopId() {
  const params = useParams<{ shopId: string }>()
  const shopId = params?.shopId ?? ''
  return <StorefrontContent shopReference={shopId} />
}
