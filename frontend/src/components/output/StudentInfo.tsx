function Line({ label }: { label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm text-neutral-900 shrink-0">{label}</span>
      <input
        type="text"
        className="flex-1 min-w-0 bg-transparent border-b border-neutral-400 focus:outline-none focus:border-neutral-900 text-sm py-0.5"
        aria-label={label}
      />
    </div>
  )
}

export default function StudentInfo({ className }: { className: string }) {
  return (
    <div className="mt-4 space-y-3">
      <Line label="Name:" />
      <Line label="Roll Number:" />
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-neutral-900 shrink-0">
          Class: {className || '____'} &nbsp; Section:
        </span>
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent border-b border-neutral-400 focus:outline-none focus:border-neutral-900 text-sm py-0.5"
          aria-label="Section"
        />
      </div>
    </div>
  )
}
