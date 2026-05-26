import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'VedaAI - Assessment Creator',
  description: 'Create AI-generated question papers for your classes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page text-neutral-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
