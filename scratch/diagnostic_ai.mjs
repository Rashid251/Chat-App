
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

import { GoogleGenerativeAI } from "@google/generative-ai";

async function testServiceLogic() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    systemInstruction: "You are Meta AI."
  });

  console.log("Testing gemini-1.5-flash-latest...");
  
  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Hi there! I am Meta AI." }] },
      ],
    });

    const result = await chat.sendMessage("How are you today?");
    const response = await result.response;
    console.log("AI Response received:", response.text());
    console.log("RESULT: SUCCESS");
  } catch (error) {
    console.error("RESULT: FAILED");
    console.error("Error details:", error.message);
  }
}

testServiceLogic();
