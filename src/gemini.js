const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateResponse(text, history = []) {

  let historyText = "";
  if (Array.isArray(history) && history.length) {
    historyText = history
      .map((m) => {
        const user = m.question ? `User: ${m.question}` : null;
        const assistant = m.reply ? `Assistant: ${m.reply}` : null;
        return [user, assistant].filter(Boolean).join("\n");
      })
      .join("\n\n");
  }

  const prompt = `You are a helpful assistant. Respond concisely and in a friendly tone. Remove any asterisks and format for direct reading.\n\nConversation history:\n${historyText}\n\nUser: ${text}\nAssistant:`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  return response.text;
}

async function generateTitle(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a concise title for a conversation from its first message. Generate multiple options. Pick and return one. Don't return multiple options. The message goes thus: ${text}.`,
  })
  return response.text
}

module.exports = { generateResponse, generateTitle };