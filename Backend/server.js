import "dotenv/config";
import mongoose from 'mongoose';
import { app } from "./app.js";
import { validateEnvironment } from "./config.js";

const PORT = process.env.PORT || 8080;

export async function startServer() {
  validateEnvironment();
  await mongoose.connect(process.env.MONGO_URI);

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const shutdown = () => {
    server.close(async (error) => {
      if (error) {
        console.error("Error closing the HTTP server:", error);
        process.exitCode = 1;
      }

      await mongoose.disconnect();
    });
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

  return server;
}

startServer().catch((error) => {
  console.error("Failed to start Orvix API:", error);
  process.exitCode = 1;
});
