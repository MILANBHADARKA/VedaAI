import { env } from '../config/env'
import { getGroq } from './groq'
import { buildUserPrompt, SYSTEM_PROMPT, type PromptInput } from './prompt'
import { llmPaperSchema, type LlmPaper } from './schema'

function stripFences(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  return fenced ? fenced[1] : trimmed
}

function renumber(paper: LlmPaper): LlmPaper {
  let n = 1
  return {
    ...paper,
    sections: paper.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({ ...q, number: n++ })),
    })),
  }
}

export async function generatePaper(input: PromptInput): Promise<LlmPaper> {
  const groq = getGroq()
  if (!groq) throw new Error('GROQ_API_KEY not configured')

  const completion = await groq.chat.completions.create({
    model: env.groqModel,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(input) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 4000,
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('LLM returned empty response')

  let json: unknown
  try {
    json = JSON.parse(stripFences(raw))
  } catch {
    throw new Error('LLM response was not valid JSON')
  }

  const parsed = llmPaperSchema.safeParse(json)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 5)
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ')
    throw new Error(`LLM response failed schema validation — ${issues}`)
  }

  return renumber(parsed.data)
}
