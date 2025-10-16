const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateResponse(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `give a proper, formatted response to this text, remove all asterisks and format for direct reading. The text you're responding to goes thus:${text}`,
  })

  return response.text;
}

async function generateTitle(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a concise title for a conversation from its first message. The message goes thus: ${text}. `,
  })
  return response.text
}

module.exports = { generateResponse, generateTitle };