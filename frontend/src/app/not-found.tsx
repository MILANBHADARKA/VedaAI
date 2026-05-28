import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">404</h1>
        <p className="text-neutral-600">This page could not be found.</p>
        <Link
          href="/assignments"
          className="inline-flex items-center h-10 px-5 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
        >
          Back to Assignments
        </Link>
      </div>
    </div>
  )
}
