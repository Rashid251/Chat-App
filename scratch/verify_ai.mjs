
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

async function verifyAI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  console.log("Testing with API Key:", apiKey ? "Present" : "MISSING");
  
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are Meta AI. Be brief."
  });

  console.log("Sending test message: 'Hello, who are you?'");
  
  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hi" }] },
        { role: "model", parts: [{ text: "Hello! I am Meta AI." }] },
      ],
    });

    const result = await chat.sendMessage("Who are you?");
    const response = await result.response;
    console.log("AI Response:", response.text());
    console.log("Verification SUCCESSFUL!");
  } catch (error) {
    console.error("Verification FAILED:", error.message);
    if (error.message.includes("API key not valid")) {
        console.log("HINT: Your API key is invalid.");
    }
  }
}

verifyAI();
