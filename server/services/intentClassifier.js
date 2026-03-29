import { groq } from "./chatbot.service.js"; // Reuse existing Groq client

/**
 * Unified Intent Classifier
 * Decides whether to route the request to the Digital Twin or Chatbot
 */
export const classifyIntent = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // 1. Digital Twin Trigger Keywords
  const digitalTwinKeywords = ["what if", "if i", "predict", "impact", "effect"];
  if (digitalTwinKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
    return "digital_twin";
  }

  // 2. Chatbot (Medical) Trigger Keywords
  // Includes pain, diseases, symptoms, and health terms
  const medicalKeywords = [
    "pain", "fever", "diarrhea", "cholesterol", "sugar", "blood pressure", "diabetes", 
    "heart", "headache", "cold", "flu", "symptoms", "disease", "treatment", "medicine",
    "doctor", "hospital", "clinic", "health", "wellness", "nutrition", "diet"
  ];
  if (medicalKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
    return "chatbot";
  }

  return "unknown"; // Default fallback to be handled by AI
};

/**
 * Robust AI-powered intent classifier (fallback mechanism)
 */
export const classifyIntentAI = async (message) => {
  try {
    const prompt = `
Classify the user message into EXACTLY ONE of these categories:
- chatbot: Use this ONLY if the query is strictly about human health, symptoms, medical conditions, diseases, medications, nutrition, or anatomy.
- digital_twin: Use this ONLY for simulations or predictions about the user's future health metrics (e.g. "what if I sleep 4 hours").
- unknown: Use this for EVERYTHING ELSE. This includes greetings (hi, hello), general knowledge (weather, history), technical help, sports, politics, or any topic NOT directly related to human medical health.

CRITICAL: If the message is a greeting or casual talk, it is UNKNOWN.

User Message: "${message}"

RESPONSE MUST BE ONLY ONE WORD: "chatbot", "digital_twin", OR "unknown".
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Strict response
      max_tokens: 10,
    });

    const category = chatCompletion.choices[0].message.content.trim().toLowerCase();
    
    // Safety check: ensure response is one of our valid keys
    if (["chatbot", "digital_twin", "unknown"].includes(category)) {
      return category;
    }
    
    return "unknown";
  } catch (error) {
    console.error("AI Intent Classify Error:", error.message);
    return "unknown";
  }
};
