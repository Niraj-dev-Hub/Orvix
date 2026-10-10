import Groq from "groq-sdk";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import getGroqAiResponse from './utils/Groqai.js';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json ());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());


app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

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

