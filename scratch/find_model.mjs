
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

import { GoogleGenerativeAI } from "@google/generative-ai";

async function findWorkingModel() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Models we saw in the list
  const candidates = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-pro",
  ];

  for (const modelName of candidates) {
    console.log(`Testing model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      const text = result.response.text();
      console.log(`SUCCESS with ${modelName}: ${text.substring(0, 20)}...`);
      return modelName;
    } catch (error) {
      console.log(`FAILED with ${modelName}: ${error.message.substring(0, 100)}`);
    }
  }
  
  console.log("No working model found.");
  return null;
}

findWorkingModel();
