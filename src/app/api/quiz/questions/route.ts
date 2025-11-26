import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const limit = searchParams.get("limit");
    const random = searchParams.get("random") === "true";

    let questions;

    if (random && limit) {
      // Get random questions for a quiz
      const count = parseInt(limit);
      
      if (topic) {
        questions = await prisma.$queryRaw`
          SELECT * FROM quiz_questions 
          WHERE topic = ${topic}
          ORDER BY RANDOM() 
          LIMIT ${count}
        `;
      } else {
        questions = await prisma.$queryRaw`
          SELECT * FROM quiz_questions 
          ORDER BY RANDOM() 
          LIMIT ${count}
        `;
      }
    } else {
      questions = await prisma.quizQuestion.findMany({
        where: topic ? { topic } : undefined,
        orderBy: { topic: "asc" },
      });
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Bulk create questions
    if (Array.isArray(body)) {
      const questions = await prisma.quizQuestion.createMany({
        data: body,
        skipDuplicates: true,
      });
      return NextResponse.json({ count: questions.count }, { status: 201 });
    }
    
    // Single question create
    const question = await prisma.quizQuestion.create({
      data: body,
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating questions:", error);
    return NextResponse.json(
      { error: "Failed to create questions" },
      { status: 500 }
    );
  }
}

