import { GoogleGenAI } from "@google/genai";
import { retryUnavailable } from "./retry.js";
import systemInstruction from "./systemInstruction.js";

let ai;
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

const getGeminiAiResponse = async (message) => {
  ai ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await retryUnavailable(() =>
    ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      },
    }),
  );

  return response.text || "No content returned.";
};


export default getGeminiAiResponse;