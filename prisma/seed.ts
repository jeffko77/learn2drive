import { PrismaClient } from '@prisma/client'
import { quizQuestions } from '../lib/quiz-questions'
import { teachingNotesByTitle } from '../lib/training-phases'

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL },
  },
})

async function backfillTeachingNotes() {
  const notes = teachingNotesByTitle()
  let updated = 0
  for (const [title, teachingNotes] of notes) {
    const result = await prisma.skill.updateMany({ where: { title }, data: { teachingNotes } })
    updated += result.count
  }
  console.log(`Updated teaching notes on ${updated} existing skills`)
}

async function replaceQuizQuestions() {
  await prisma.quizQuestion.deleteMany()
  await prisma.quizQuestion.createMany({ data: quizQuestions })
  console.log(`Replaced quiz questions with ${quizQuestions.length} sourced items`)
}

async function main() {
  console.log('Seeding database...')
  await backfillTeachingNotes()
  await replaceQuizQuestions()
  console.log('Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
