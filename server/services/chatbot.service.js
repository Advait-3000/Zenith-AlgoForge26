import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generatePatientFriendlyResponse = async (context, question) => {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `${context}\nQuestion: ${question}`,
      },
    ],
  });

  return chatCompletion.choices[0].message.content;
};