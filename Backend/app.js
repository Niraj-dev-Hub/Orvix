import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/authRoutes.js";

export const app = express();

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  exposedHeaders: ["X-Request-Id"]
}));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "not_ready",
    database: databaseReady ? "connected" : "disconnected"
  });
});

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
