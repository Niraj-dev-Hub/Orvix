import { retryUnavailable } from "./retry.js";
import systemInstruction from "./systemInstruction.js";

const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const getGroqResponse = async (message) => {
  return retryUnavailable(async () => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message },
        ],
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      const error = new Error(
        result.error?.message || `Groq API request failed (${response.status})`,
      );
      error.status = response.status;
      throw error;
    }

    const reply = result.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      throw new Error("Groq API returned an empty response");
    }

    return reply;
  });
};

export default getGroqResponse;
