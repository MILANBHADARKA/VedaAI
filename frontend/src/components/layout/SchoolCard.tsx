/* eslint-disable @next/next/no-img-element */

export default function SchoolCard() {
  return (
    <div className="mx-4 mb-4 p-3 bg-surface border border-neutral-300 rounded-2xl flex items-center gap-3">
      <img
        src="/icons/avatar.svg"
        alt=""
        width={40}
        height={40}
        className="rounded-full bg-neutral-100"
      />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-neutral-900 truncate">
          Delhi Public School
        </div>
        <div className="text-xs text-neutral-600 truncate">Bokaro Steel City</div>
      </div>
    </div>
  )
}
