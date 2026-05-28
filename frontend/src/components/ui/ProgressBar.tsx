export default function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
