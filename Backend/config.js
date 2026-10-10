export function validateEnvironment(env = process.env) {
  const requiredValues = ["MONGO_URI", "JWT_SECRET", "GEMINI_API_KEY"];
  const missingValues = requiredValues.filter((key) => !env[key]?.trim());

  if (missingValues.length > 0) {
    throw new Error(`Missing required environment variables: ${missingValues.join(", ")}`);
  }

  if (env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  if (env.NODE_ENV === "production") {
    if (!env.CLIENT_URL?.trim()) {
      throw new Error("CLIENT_URL is required in production");
    }

    let clientUrl;
    try {
      clientUrl = new URL(env.CLIENT_URL);
    } catch {
      throw new Error("CLIENT_URL must be a valid absolute URL");
    }

    if (clientUrl.protocol !== "https:") {
      throw new Error("CLIENT_URL must use HTTPS in production");
    }
  }
}
