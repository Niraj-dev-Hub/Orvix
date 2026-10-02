import Groq from "groq-sdk";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import getGroqAiResponse from './utils/Groqai.js';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";




dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json ());
app.use(cors());


app.use("/api", chatRoutes);
app.listen(PORT, () =>{
  console.log('Server is running on port ' + PORT);
  connectDB();
});



const mongoURI = process.env.MONGO_URI;

const connectDB = async () =>{
  try {
     await mongoose.connect(mongoURI);
     console.log("Database connected successfully");
  } catch (err) {
       console.error("Database connection error:", err); 
       }


};


// app.post("/test", async(req, res) =>{
//      const response = await getGroqAiResponse(req.body.message);
//      res.json({message: response});

// });


// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function main() {
//   try {
//     const chatCompletion = await getGroqChatCompletion();
//     // Print the completion returned by the LLM.
//     console.log(chatCompletion.choices[0]?.message?.content || "No content returned.");
//   } catch (error) {
//     console.error("Error fetching chat completion:", error);
//   }
// }

// export async function getGroqChatCompletion() {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "difference between a cat and a dog",
//       },
//     ],
//     // 'openai/gpt-oss-20b' is valid, or use standard models like 'llama-3.3-70b-versatile'
//     model: "openai/gpt-oss-20b", 
//   });
// }

// // CRITICAL: You must explicitly call the main function so it executes!
// main();
