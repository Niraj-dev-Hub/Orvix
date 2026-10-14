import getGeminiAiResponse from "./Gemini.js";
import getGroqResponse from "./Groq.js";

export const chatProviders = ["gemini", "groq"];

export function getChatResponse(provider, message) {
  if (provider === "gemini") {
    return getGeminiAiResponse(message);
  }
  if (provider === "groq") {
    return getGroqResponse(message);
  }

  throw new Error(`Unsupported chat provider: ${provider}`);
}
