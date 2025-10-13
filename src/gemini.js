const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateResponse(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
  })

  return response.text;
}

async function generateTitle(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a concise title for a conversation from its first message. The message goes thus: ${text}. `,
  })
}

module.exports = { generateResponse, generateTitle };