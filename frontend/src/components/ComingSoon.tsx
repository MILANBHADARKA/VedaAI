export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <p className="text-neutral-600">Coming soon.</p>
      </div>
    </div>
  )
}
