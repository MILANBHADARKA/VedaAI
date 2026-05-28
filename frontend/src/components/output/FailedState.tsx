import Link from 'next/link'

export default function FailedState({ error }: { error?: string | null }) {
  return (
    <div className="max-w-md mx-auto py-24 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-challenging-bg flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5M12 16h.01"
            stroke="#B42424"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke="#B42424" strokeWidth="2" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">
        Generation failed
      </h2>
      <p className="text-sm text-neutral-600 mt-1 break-words">
        {error ?? 'Something went wrong while generating this paper.'}
      </p>
      <Link
        href="/assignments"
        className="inline-flex items-center mt-6 h-10 px-5 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
      >
        Back to Assignments
      </Link>
    </div>
  )
}
