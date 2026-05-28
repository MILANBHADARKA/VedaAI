'use client'

import type { GeneratedPaper } from '@/lib/types'
import AiBanner from './AiBanner'
import AnswerKey from './AnswerKey'
import PaperHeader from './PaperHeader'
import SectionBlock from './SectionBlock'
import StudentInfo from './StudentInfo'

type Props = {
  paper: GeneratedPaper
  assignmentId: string
  onRegenerate: () => void
  regenerating: boolean
}

export default function PaperView({
  paper,
  assignmentId,
  onRegenerate,
  regenerating,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      <AiBanner
        assignmentId={assignmentId}
        header={paper.header}
        onRegenerate={onRegenerate}
        regenerating={regenerating}
      />

      <article className="bg-surface rounded-2xl shadow-card p-6 sm:p-10 print:shadow-none print:rounded-none print:p-0">
        <PaperHeader header={paper.header} />
        <StudentInfo className={paper.header.className} />

        {paper.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}

        <p className="mt-8 text-center text-sm font-semibold text-neutral-900">
          End of Question Paper
        </p>

        <AnswerKey sections={paper.sections} />
      </article>
    </div>
  )
}
