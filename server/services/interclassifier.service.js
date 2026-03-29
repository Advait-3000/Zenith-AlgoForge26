export const classifyIntent = (text) => {
  const input = text.toLowerCase();

  // 🔮 Digital Twin keywords
  const twinKeywords = [
    "what if",
    "if i",
    "will i",
    "impact",
    "effect",
    "predict",
    "future",
    "increase",
    "decrease"
  ];

  for (let word of twinKeywords) {
    if (input.includes(word)) {
      return "digital_twin";
    }
  }

  return "chatbot";
};