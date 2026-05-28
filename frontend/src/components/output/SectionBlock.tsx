import type { ResultSection } from '@/lib/types'
import QuestionItem from './QuestionItem'

export default function SectionBlock({ section }: { section: ResultSection }) {
  const sectionLabel = `Section ${section.id}`
  const showTitle =
    section.title &&
    section.title.trim().toLowerCase() !== sectionLabel.toLowerCase()

  return (
    <section className="mt-8">
      <h3 className="text-center text-base font-bold text-neutral-900">
        {sectionLabel}
      </h3>
      {showTitle && (
        <h4 className="mt-3 text-sm font-semibold text-neutral-900">
          {section.title}
        </h4>
      )}
      {section.instruction && (
        <p className="mt-1 text-sm italic text-neutral-600">
          {section.instruction}
        </p>
      )}
      <ol className="mt-3 space-y-3">
        {section.questions.map((q) => (
          <QuestionItem key={q.number} question={q} />
        ))}
      </ol>
    </section>
  )
}
