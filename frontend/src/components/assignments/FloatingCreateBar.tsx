/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import PrimaryPill from '@/components/ui/PrimaryPill'

export default function FloatingCreateBar() {
  return (
    <>
      <div className="hidden lg:flex sticky bottom-2 justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <PrimaryPill href="/assignments/new" icon="/icons/sparkle.png">
            Create Assignment
          </PrimaryPill>
        </div>
      </div>

      <Link
        href="/assignments/new"
        aria-label="Create Assignment"
        className="lg:hidden fixed right-5 bottom-24 h-12 w-12 rounded-full bg-brand text-white shadow-popover flex items-center justify-center text-2xl font-light"
      >
        +
      </Link>
    </>
  )
}
