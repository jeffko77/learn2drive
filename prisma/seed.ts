import { PrismaClient } from '@prisma/client'
import { quizQuestions } from '../lib/quiz-questions'
import { teachingNotesByTitle } from '../lib/training-phases'

function databaseUrl() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL / DIRECT_URL are not set. Copy .env.example to .env and paste your Neon URLs (the same values as `fly secrets`). Prisma migrate needs DIRECT_URL; the app uses DATABASE_URL.',
    )
  }
  return url
}

async function backfillTeachingNotes(prisma: PrismaClient) {
  const notes = teachingNotesByTitle()
  let updated = 0
  for (const [title, teachingNotes] of notes) {
    const result = await prisma.skill.updateMany({ where: { title }, data: { teachingNotes } })
    updated += result.count
  }
  console.log(`Updated teaching notes on ${updated} existing skills`)
}

async function replaceQuizQuestions(prisma: PrismaClient) {
  await prisma.quizQuestion.deleteMany()
  await prisma.quizQuestion.createMany({ data: quizQuestions })
  console.log(`Replaced quiz questions with ${quizQuestions.length} sourced items`)
}

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl() },
    },
  })
  try {
    console.log('Seeding database...')
    await backfillTeachingNotes(prisma)
    await replaceQuizQuestions(prisma)
    console.log('Seeding complete!')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
