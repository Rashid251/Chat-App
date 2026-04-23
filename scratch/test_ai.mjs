
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

async function testAI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  console.log("API Key found:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
  
  // Try different model names if one fails
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  
  for (const model of models) {
    console.log(`Testing model: ${model}`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Hello, reply with only one word 'Hi'." }],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log(`Model ${model} status:`, response.status);
      if (response.ok) {
        console.log(`Model ${model} response:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
        break; 
      } else {
        console.log(`Model ${model} error:`, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error(`Fetch error for ${model}:`, error);
    }
  }
}

testAI();
