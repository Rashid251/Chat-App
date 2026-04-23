
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Listing available models...");
    // Note: The SDK doesn't have a direct listModels method in all versions, 
    // but we can try to fetch it via the API url
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
