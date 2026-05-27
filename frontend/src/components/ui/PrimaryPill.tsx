/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { cn } from '@/lib/cn'

type Props = {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  icon?: string
  className?: string
  size?: 'md' | 'lg'
}

const SIZE = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
} as const

export default function PrimaryPill({
  href,
  onClick,
  children,
  icon,
  className,
  size = 'md',
}: Props) {
  const inner = (
    <>
      {icon && (
        <img src={icon} alt="" width={16} height={16} className="shrink-0" />
      )}
      <span>{children}</span>
    </>
  )
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] shadow-button hover:from-[#333] hover:to-[#1a1a1a] transition-colors',
    SIZE[size],
    className,
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}
