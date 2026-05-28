import type Groq from 'groq-sdk'
import { env } from '../config/env'
import { getGroq } from './groq'
import { buildUserPrompt, SYSTEM_PROMPT, type PromptInput } from './prompt'
import { checkPaperQuality } from './quality'
import { llmPaperSchema, type LlmPaper } from './schema'

const MAX_ATTEMPTS = 3
const FALLBACK_FROM_ATTEMPT = 3

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const backoffMs = (attempt: number) =>
  300 * 2 ** (attempt - 2) + Math.floor(Math.random() * 150)

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

function parsePaper(raw: string): LlmPaper {
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
  return parsed.data
}

async function callModel(
  groq: Groq,
  model: string,
  correction: string | null,
  input: PromptInput,
): Promise<string> {
  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserPrompt(input) },
  ]
  if (correction) messages.push({ role: 'user', content: correction })

  const completion = await groq.chat.completions.create({
    model,
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 4000,
  })
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('LLM returned empty response')
  return raw
}

function buildCorrection(issues: string[]): string {
  return `Your previous response had these problems:\n${issues
    .map((i) => `- ${i}`)
    .join(
      '\n',
    )}\nReturn the COMPLETE corrected question paper as JSON, fixing every problem above. Output JSON only.`
}

export async function generatePaper(input: PromptInput): Promise<LlmPaper> {
  const groq = getGroq()
  if (!groq) throw new Error('GROQ_API_KEY not configured')

  const expected = {
    totalQuestions: input.totalQuestions,
    totalMarks: input.totalMarks,
  }
  let correction: string | null = null
  let lastError = 'unknown error'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) await sleep(backoffMs(attempt))
    const model =
      attempt >= FALLBACK_FROM_ATTEMPT ? env.groqFallbackModel : env.groqModel
    try {
      const raw = await callModel(groq, model, correction, input)
      const paper = parsePaper(raw)
      const issues = checkPaperQuality(paper, expected)
      if (issues.length === 0) return renumber(paper)
      correction = buildCorrection(issues)
      lastError = `quality check failed — ${issues.join(' ')}`
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
    }
    console.warn(`[ai] attempt ${attempt} (${model}) failed: ${lastError}`)
  }

  throw new Error(
    `Paper generation failed after ${MAX_ATTEMPTS} attempts — ${lastError}`,
  )
}
