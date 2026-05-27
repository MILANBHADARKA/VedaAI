import type { QuestionType } from '../lib/types'

export type PromptInput = {
  questionTypes: { type: QuestionType; count: number; marks: number }[]
  totalQuestions: number
  totalMarks: number
  additionalInstructions: string
  fileHint: string | null
}

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: 'Multiple choice questions',
  short_answer: 'Short answer questions',
  long_answer: 'Long answer questions',
  diagram_graph: 'Diagram or graph based questions',
  numerical: 'Numerical problems',
  true_false: 'True / false questions',
  fill_blanks: 'Fill in the blanks',
}

export const SYSTEM_PROMPT = `You are an expert exam-paper generator for school teachers. Produce a complete, well-structured question paper from the teacher's specification.

Return a JSON object with this exact shape:

{
  "header": {
    "schoolName": string,
    "subject": string,
    "className": string,
    "timeAllowedMinutes": number,
    "maxMarks": number,
    "generalInstructions": string[]
  },
  "sections": [{
    "id": "A" | "B" | "C" | "D" | "E",
    "title": string,
    "instruction": string,
    "questions": [{
      "number": number,
      "text": string,
      "difficulty": "easy" | "moderate" | "challenging",
      "marks": number,
      "options": [string, string, string, string] | null,
      "answer": string
    }]
  }]
}

Rules:
1. Output JSON only. No markdown fences, no commentary, no preamble.
2. Create one section per question type provided, lettered A, B, C... in the order given.
3. Question "number" is globally sequential across all sections, starting at 1.
4. For "multiple_choice", "options" is an array of exactly 4 plausible choices and "answer" must exactly match one of them.
5. For every other type, "options" must be null and "answer" must be a complete model answer suitable for an answer key.
6. "difficulty" must be exactly one of "easy", "moderate", "challenging". Mix difficulties — don't make every question the same level.
7. The sum of "marks" across all questions must equal the requested total marks.
8. The total question count must equal the requested total questions.
9. Use the teacher's additional instructions to infer subject, class level, school name, and topic. If a value isn't given, choose a sensible one.
10. Each question text should be self-contained and unambiguous.`

export function buildUserPrompt(input: PromptInput): string {
  const breakdown = input.questionTypes
    .map(
      (row) =>
        `- ${QUESTION_TYPE_LABEL[row.type]}: ${row.count} question${row.count === 1 ? '' : 's'} × ${row.marks} mark${row.marks === 1 ? '' : 's'} each`,
    )
    .join('\n')

  const fileLine = input.fileHint
    ? `\nA reference file was attached by the teacher: ${input.fileHint}. Generate questions consistent with its likely subject matter.\n`
    : ''

  const instructions = input.additionalInstructions.trim() || '(none provided)'

  return `Generate a question paper with these specifications:

Total questions: ${input.totalQuestions}
Total marks: ${input.totalMarks}

Question types requested:
${breakdown}
${fileLine}
Teacher's additional instructions:
"""
${instructions}
"""`
}
