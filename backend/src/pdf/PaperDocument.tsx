import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Difficulty } from '../lib/types'

type Question = {
  number: number
  text: string
  difficulty: Difficulty
  marks: number
  options?: string[]
  answer: string
}

type Section = {
  id: string
  title: string
  instruction: string
  questions: Question[]
}

type Header = {
  schoolName: string
  subject: string
  className: string
  timeAllowedMinutes: number
  maxMarks: number
  generalInstructions: string[]
}

export type PaperData = { header: Header; sections: Section[] }

const DIFF: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: '#1F8A4C' },
  moderate: { label: 'Moderate', color: '#B5651A' },
  challenging: { label: 'Challenging', color: '#B42424' },
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
    lineHeight: 1.5,
  },
  schoolName: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  center: { textAlign: 'center', marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  instruction: { marginTop: 6, color: '#444444' },
  studentBlock: { marginTop: 12 },
  studentLine: { marginTop: 4 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 16,
  },
  subTitle: { fontFamily: 'Helvetica-Bold', marginTop: 8 },
  sectionInstruction: {
    fontFamily: 'Helvetica-Oblique',
    color: '#666666',
    marginTop: 2,
  },
  qRow: { flexDirection: 'row', marginTop: 6 },
  qNum: { width: 20 },
  qBody: { flex: 1 },
  marks: { color: '#666666' },
  options: { marginTop: 2, marginLeft: 12 },
  end: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    marginTop: 16,
  },
  answerTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, marginTop: 20 },
  answerRow: { flexDirection: 'row', marginTop: 4 },
})

const optionLetter = (i: number) => String.fromCharCode(97 + i)

export function PaperDocument({
  paper,
  includeAnswers,
}: {
  paper: PaperData
  includeAnswers: boolean
}) {
  const { header, sections } = paper
  const answers = sections.flatMap((s) =>
    s.questions.map((q) => ({ number: q.number, answer: q.answer })),
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.schoolName}>{header.schoolName}</Text>
        {header.subject ? (
          <Text style={styles.center}>Subject: {header.subject}</Text>
        ) : null}
        {header.className ? (
          <Text style={styles.center}>Class: {header.className}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text>Time Allowed: {header.timeAllowedMinutes} minutes</Text>
          <Text>Maximum Marks: {header.maxMarks}</Text>
        </View>

        {header.generalInstructions.map((line, i) => (
          <Text key={i} style={styles.instruction}>
            {line}
          </Text>
        ))}

        <View style={styles.studentBlock}>
          <Text style={styles.studentLine}>
            Name: _______________________________
          </Text>
          <Text style={styles.studentLine}>
            Roll Number: ________________________
          </Text>
          <Text style={styles.studentLine}>
            Class: {header.className || '______'} Section: ____________
          </Text>
        </View>

        {sections.map((section) => {
          const label = `Section ${section.id}`
          const showTitle =
            section.title &&
            section.title.trim().toLowerCase() !== label.toLowerCase()
          return (
            <View key={section.id}>
              <Text style={styles.sectionTitle}>{label}</Text>
              {showTitle ? (
                <Text style={styles.subTitle}>{section.title}</Text>
              ) : null}
              {section.instruction ? (
                <Text style={styles.sectionInstruction}>
                  {section.instruction}
                </Text>
              ) : null}
              {section.questions.map((q) => (
                <View key={q.number} style={styles.qRow} wrap={false}>
                  <Text style={styles.qNum}>{q.number}.</Text>
                  <View style={styles.qBody}>
                    <Text>
                      <Text style={{ color: DIFF[q.difficulty].color }}>
                        [{DIFF[q.difficulty].label}]{' '}
                      </Text>
                      {q.text}{' '}
                      <Text style={styles.marks}>
                        [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                      </Text>
                    </Text>
                    {q.options && q.options.length > 0 ? (
                      <View style={styles.options}>
                        {q.options.map((opt, i) => (
                          <Text key={i}>
                            ({optionLetter(i)}) {opt}
                          </Text>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )
        })}

        <Text style={styles.end}>End of Question Paper</Text>

        {includeAnswers ? (
          <View>
            <Text style={styles.answerTitle}>Answer Key:</Text>
            {answers.map((a) => (
              <View key={a.number} style={styles.answerRow}>
                <Text style={styles.qNum}>{a.number}.</Text>
                <Text style={styles.qBody}>{a.answer}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
