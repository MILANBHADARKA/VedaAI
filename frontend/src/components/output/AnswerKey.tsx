import type { ResultSection } from '@/lib/types'

export default function AnswerKey({ sections }: { sections: ResultSection[] }) {
  const answers = sections.flatMap((s) =>
    s.questions.map((q) => ({ number: q.number, answer: q.answer })),
  )
  if (answers.length === 0) return null

  return (
    <section className="mt-10 pt-6 border-t border-neutral-300">
      <h3 className="text-base font-bold text-neutral-900">Answer Key:</h3>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-800">
        {answers.map((a) => (
          <li key={a.number} className="flex gap-2">
            <span className="font-medium shrink-0">{a.number}.</span>
            <span className="flex-1">{a.answer}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
