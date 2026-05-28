/* eslint-disable @next/next/no-img-element */

import Spinner from '@/components/ui/Spinner'

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <img src="/icons/logo.png" alt="" width={28} height={28} />
        <span className="text-lg font-semibold text-neutral-900">VedaAI</span>
      </div>
      <Spinner className="text-brand h-6 w-6" />
    </div>
  )
}
