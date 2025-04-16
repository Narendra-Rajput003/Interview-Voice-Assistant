import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Generate interview questions for a job role of ${role} at ${level} experience level, using the tech stack: ${techstack}. 
          Focus on ${type} questions, with ${type === 'Technical' ? '70% technical and 30% behavioral' : type === 'Behavioral' ? '70% behavioral and 30% technical' : '50% technical and 50% behavioral'}.
          Create exactly ${amount} questions, ensuring variety (e.g., scenario-based, conceptual, practical for technical; situational, reflective for behavioral).
          Questions must be concise (under 20 words), clear, and suitable for a voice assistant to read aloud without special characters like slashes or asterisks.
          Tailor question difficulty to ${level} (e.g., Junior: foundational; Mid-level: practical application; Senior: strategic or complex).
          Avoid generic or repetitive questions. Do not include explanations or additional text.
          Return the questions in this format: ["Question 1", "Question 2", "Question 3"]
        `,
      });

    const interview = {
        role:role,
        type: type,
        level: level,
        techstack:techstack.split(","),
        questions:JSON.parse(questions),
        userId: userid,
        finalized: true,
        coverImage:getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
    }

    await db.collection("interviews").add(interview)
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
    return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
  }