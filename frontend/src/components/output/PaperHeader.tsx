import type { ResultHeader } from '@/lib/types'

export default function PaperHeader({ header }: { header: ResultHeader }) {
  return (
    <header>
      <h2 className="text-center text-xl font-bold text-neutral-900">
        {header.schoolName}
      </h2>
      {header.subject && (
        <p className="text-center text-sm text-neutral-900 mt-1">
          Subject: {header.subject}
        </p>
      )}
      {header.className && (
        <p className="text-center text-sm text-neutral-900">
          Class: {header.className}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-900">
        <span>Time Allowed: {header.timeAllowedMinutes} minutes</span>
        <span>Maximum Marks: {header.maxMarks}</span>
      </div>

      {header.generalInstructions.length > 0 && (
        <div className="mt-3 text-sm text-neutral-700 space-y-0.5">
          {header.generalInstructions.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </header>
  )
}
