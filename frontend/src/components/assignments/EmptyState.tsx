/* eslint-disable @next/next/no-img-element */
import PrimaryPill from '@/components/ui/PrimaryPill'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <img
        src="/icons/empty-state.svg"
        alt=""
        width={220}
        height={220}
        className="mb-6"
      />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        No assignments yet
      </h2>
      <p className="text-sm text-neutral-600 max-w-md mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let
        AI assist with grading.
      </p>
      <PrimaryPill href="/assignments/new" icon="/icons/sparkle.png">
        Create Your First Assignment
      </PrimaryPill>
    </div>
  )
}
