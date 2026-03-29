import { groq } from "./chatbot.service.js";

export const generateHealthPrediction = async ({ logs, report, action }) => {
  try {
    let reportContext = "No recent medical report available.";
    if (report && report.ai_analysis && report.ai_analysis.keyMetrics) {
      const metrics = report.ai_analysis.keyMetrics;
      reportContext = `Sugar: ${metrics.sugarLevel || 'N/A'}, Cholesterol: ${metrics.cholesterol || 'N/A'}, BP: ${metrics.bp || 'N/A'}`;
    }

    const logContext = logs.length > 0
      ? logs.slice(-3).map(l => `Sleep: ${l.sleepHours}h, Calories: ${l.calories}, Steps: ${l.steps}`).join(' | ')
      : "No previous health logs available.";

    const promptMessage = `
User Health Data:
- Sleep patterns, Calories, Activity: ${logContext}
- Latest report metrics: ${reportContext}

User Planned Action:
${JSON.stringify(action)}

Task:
- Predict health impact
- Keep it simple
- Use bullet points
- Max 5 points
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: promptMessage }],
      temperature: 0.7,
      max_tokens: 250,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Prediction Error:", error.message);
    return "- AI prediction is temporarily unavailable.";
  }
};
