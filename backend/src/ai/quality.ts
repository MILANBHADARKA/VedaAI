import type { LlmPaper } from './schema'

export function checkPaperQuality(
  paper: LlmPaper,
  expected: { totalQuestions: number; totalMarks: number },
): string[] {
  const issues: string[] = []
  const questions = paper.sections.flatMap((s) => s.questions)

  if (questions.length !== expected.totalQuestions) {
    issues.push(
      `The paper must contain exactly ${expected.totalQuestions} questions but has ${questions.length}.`,
    )
  }

  const marksSum = questions.reduce((sum, q) => sum + q.marks, 0)
  if (marksSum !== expected.totalMarks) {
    issues.push(
      `The marks of all questions must add up to ${expected.totalMarks} but currently total ${marksSum}.`,
    )
  }

  for (const q of questions) {
    if (!q.options || q.options.length === 0) continue

    const normalized = q.options.map((o) => o.trim().toLowerCase())
    if (new Set(normalized).size !== normalized.length) {
      issues.push(`Question ${q.number} has duplicate options.`)
    }

    const exactMatches = q.options.filter(
      (o) => o.trim() === q.answer.trim(),
    ).length
    if (exactMatches !== 1) {
      issues.push(
        `Question ${q.number}: "answer" must exactly match exactly one of its options (matched ${exactMatches}).`,
      )
    }
  }

  return issues
}
