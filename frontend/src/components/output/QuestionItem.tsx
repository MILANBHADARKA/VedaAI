import type { ResultQuestion } from '@/lib/types'
import DifficultyBadge from './DifficultyBadge'

const optionLabel = (i: number) => String.fromCharCode(97 + i)

export default function QuestionItem({
  question,
}: {
  question: ResultQuestion
}) {
  const marks = `${question.marks} ${question.marks === 1 ? 'Mark' : 'Marks'}`
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-neutral-900">
      <span className="font-medium shrink-0">{question.number}.</span>
      <div className="flex-1 min-w-0">
        <span>
          <DifficultyBadge difficulty={question.difficulty} />{' '}
          {question.text}{' '}
          <span className="text-neutral-500 whitespace-nowrap">[{marks}]</span>
        </span>
        {question.options && question.options.length > 0 && (
          <ol className="mt-1.5 ml-1 space-y-1 text-neutral-700">
            {question.options.map((opt, i) => (
              <li key={i}>
                <span className="font-medium">({optionLabel(i)})</span> {opt}
              </li>
            ))}
          </ol>
        )}
      </div>
    </li>
  )
}
