/* eslint-disable @next/next/no-img-element */
'use client'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function AdditionalInfo({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-900">
        Additional Information{' '}
        <span className="text-neutral-500 font-normal">(For better output)</span>
      </label>
      <div className="mt-2 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Generate a question paper for 3 hour exam duration..."
          rows={3}
          maxLength={2000}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-300 bg-surface text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 resize-none"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="absolute right-3 bottom-3 h-8 w-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
        >
          <img src="/icons/mic.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  )
}
