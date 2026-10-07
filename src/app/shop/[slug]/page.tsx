'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { StorefrontContent } from '@/components/storefront-content'

export default function ShopBySlugPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading storefront…</div>}>
      <ShopBySlugContent />
    </Suspense>
  )
}

function ShopBySlugContent() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ''
  return <StorefrontContent shopReference={slug} />
}
