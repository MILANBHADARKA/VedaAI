import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx'
import type { Difficulty } from '../lib/types'
import type { PaperData } from '../pdf/PaperDocument'

const DIFF: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: '1F8A4C' },
  moderate: { label: 'Moderate', color: 'B5651A' },
  challenging: { label: 'Challenging', color: 'B42424' },
}

const optionLetter = (i: number) => String.fromCharCode(97 + i)

export async function renderPaperDocx(
  paper: PaperData,
  includeAnswers: boolean,
): Promise<Buffer> {
  const { header, sections } = paper
  const children: Paragraph[] = []

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: header.schoolName, bold: true, size: 32 })],
    }),
  )
  if (header.subject) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun(`Subject: ${header.subject}`)],
      }),
    )
  }
  if (header.className) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun(`Class: ${header.className}`)],
      }),
    )
  }

  children.push(
    new Paragraph({
      spacing: { before: 160 },
      children: [
        new TextRun(`Time Allowed: ${header.timeAllowedMinutes} minutes`),
        new TextRun({ text: `\t\tMaximum Marks: ${header.maxMarks}` }),
      ],
    }),
  )
  for (const line of header.generalInstructions) {
    children.push(
      new Paragraph({ children: [new TextRun({ text: line, color: '444444' })] }),
    )
  }

  children.push(
    new Paragraph({
      spacing: { before: 200 },
      children: [new TextRun('Name: _______________________________')],
    }),
  )
  children.push(
    new Paragraph({
      children: [new TextRun('Roll Number: ________________________')],
    }),
  )
  children.push(
    new Paragraph({
      children: [
        new TextRun(
          `Class: ${header.className || '______'}   Section: ____________`,
        ),
      ],
    }),
  )

  for (const section of sections) {
    const label = `Section ${section.id}`
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240 },
        children: [new TextRun({ text: label, bold: true, size: 24 })],
      }),
    )
    const showTitle =
      section.title &&
      section.title.trim().toLowerCase() !== label.toLowerCase()
    if (showTitle) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: section.title, bold: true })] }),
      )
    }
    if (section.instruction) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: section.instruction, italics: true, color: '666666' }),
          ],
        }),
      )
    }
    for (const q of section.questions) {
      const marks = `${q.marks} ${q.marks === 1 ? 'Mark' : 'Marks'}`
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: `${q.number}. `, bold: true }),
            new TextRun({ text: `[${DIFF[q.difficulty].label}] `, color: DIFF[q.difficulty].color }),
            new TextRun(`${q.text} `),
            new TextRun({ text: `[${marks}]`, color: '666666' }),
          ],
        }),
      )
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, i) => {
          children.push(
            new Paragraph({
              indent: { left: 360 },
              children: [new TextRun(`(${optionLetter(i)}) ${opt}`)],
            }),
          )
        })
      }
    }
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240 },
      children: [new TextRun({ text: 'End of Question Paper', bold: true })],
    }),
  )

  if (includeAnswers) {
    children.push(
      new Paragraph({
        spacing: { before: 320 },
        children: [new TextRun({ text: 'Answer Key:', bold: true, size: 24 })],
      }),
    )
    for (const section of sections) {
      for (const q of section.questions) {
        children.push(
          new Paragraph({
            spacing: { before: 40 },
            children: [
              new TextRun({ text: `${q.number}. `, bold: true }),
              new TextRun(q.answer),
            ],
          }),
        )
      }
    }
  }

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBuffer(doc)
}
