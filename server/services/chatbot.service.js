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
        role: "system",
        content: `You are a professional medical chatbot. 
        STRIC RULE: You ONLY answer questions related to human medical health, anatomy, symptoms, and diseases. 
        If the user asks about anything else (greetings like "How are you", weather, tech, sports, common chat), 
        you MUST politely state: "I am a dedicated medical assistant. Please ask a health-related question."`
      },
      {
        role: "user",
        content: `${context}\nQuestion: ${question}`,
      },
    ],
  });

  return chatCompletion.choices[0].message.content;
};