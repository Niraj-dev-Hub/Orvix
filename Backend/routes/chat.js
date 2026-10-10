import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAiResponse from "../utils/Gemini.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// get all threads
router.get("/thread", protectRoute, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.get("/thread/:threadId", protectRoute, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId, userId: req.user.id });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.json(thread);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.delete("/thread/:threadId", protectRoute, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.id
    });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.status(200).json({ success: "Thread deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", protectRoute, async (req, res) => {
  const { threadId, message } = req.body;

  if (typeof threadId !== "string" || !threadId.trim() ||
      typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let failureStage = "load_thread";
  try {
    const trimmedThreadId = threadId.trim();
    const trimmedMessage = message.trim();
    let thread = await Thread.findOne({
      threadId: trimmedThreadId,
      userId: req.user.id
    });

    if (!thread) {
      const threadExists = await Thread.exists({ threadId: trimmedThreadId });
      if (threadExists) {
        return res.status(404).json({ error: "Thread not found" });
      }

      thread = new Thread({
        threadId: trimmedThreadId,
        userId: req.user.id,
        title: trimmedMessage,
        messages: [{ role: "user", content: trimmedMessage }],
      });
    } else {
      thread.messages.push({ role: "user", content: trimmedMessage });
    }

    failureStage = "generate_reply";
    const assistantReply = await getGeminiAiResponse(trimmedMessage);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    failureStage = "save_thread";
    await thread.save();

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat request failed:", {
      requestId: req.requestId,
      stage: failureStage,
      name: err.name,
      message: err.message,
      status: err.status,
      code: err.code
    });
    return res.status(500).json({
      error: "Chat request failed",
      requestId: req.requestId
    });
  }
});

export default router;
