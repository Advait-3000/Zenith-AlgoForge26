// services/geminiService.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePatientFriendlyResponse(context, question) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a medical assistant for patients.

Convert medical data into SIMPLE, NON-TECHNICAL language.

Rules:
- No jargon
- Use analogies
- Keep it short
- Be calm and reassuring
- Never diagnose
- Suggest doctor visit if needed

Context:
${context}

Patient Question:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { generatePatientFriendlyResponse };