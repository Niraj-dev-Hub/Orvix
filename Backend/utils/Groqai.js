import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const systemInstruction = "Be helpful, concise, and lightly conversational, like a modern AI assistant. Give a direct answer first, then add a brief useful explanation instead of replying with only yes or no. Use a short paragraph of 1 to 3 sentences for ordinary questions. When the user asks for multiple items, steps, options, or a list, use a clear Markdown numbered or bulleted list with one item per line. When the user asks for code, briefly explain what the solution does, then put the complete code in a fenced Markdown code block (```language ... ```), followed by one short usage note or explanation. Keep code on separate lines and never put explanatory text inside the code block. Use headings only when they improve clarity, never use HTML, and avoid unnecessary detail.";

const getGroqAiResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return response.text || "No content returned.";
  } catch (error) {
    console.error("Error fetching Gemini completion:", error);
    throw error;
  }
};


export default getGroqAiResponse;