/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function CreateAssignmentButton() {
  return (
    <Link
      href="/assignments/new"
      className="group flex items-center justify-center gap-2 h-11 rounded-full px-5 text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] shadow-button hover:from-[#333] hover:to-[#1a1a1a] relative overflow-hidden"
    >
      <span className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-brand/40 to-transparent blur-md pointer-events-none" />
      <img
        src="/icons/sparkle.png"
        alt=""
        width={16}
        height={16}
        className="relative"
      />
      <span className="relative">Create Assignment</span>
    </Link>
  )
}
