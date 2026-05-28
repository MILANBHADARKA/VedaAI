/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/icons/logo.png" alt="" width={32} height={32} />
          <span className="text-xl font-semibold text-neutral-900">VedaAI</span>
        </div>

        <div className="bg-surface rounded-3xl shadow-card p-7 sm:p-8">
          <header className="mb-6">
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
            )}
          </header>
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-neutral-600 mt-5">{footer}</p>
        )}
      </div>
    </div>
  )
}
