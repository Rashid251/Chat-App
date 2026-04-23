import { GoogleGenerativeAI } from "@google/generative-ai";
import UserModel from "../models/user.model";
import { Env } from "../config/env.config";

export const getAIUser = async () => {
  let aiUser = await UserModel.findOne({ isAI: true });

  if (!aiUser) {
    aiUser = await UserModel.create({
      name: "Meta AI",
      email: "meta-ai@system.local",
      password: "system-generated-password",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      isAI: true,
    });
  }

  return aiUser;
};

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(Env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export const generateAIResponse = async (
  prompt: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = []
) => {
  try {
    if (!Env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a helpful and friendly AI assistant named Meta AI. Keep your responses concise, engaging, and helpful. You are part of a real-time messaging platform."
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("FULL AI ERROR:", error);
    console.error("Error Message:", error.message);
    
    // Check for specific API errors
    if (error.message?.includes("API key not valid")) {
      return "I'm sorry, my API key seems to be invalid. Please check the backend configuration.";
    }
    
    return "I'm sorry, I'm having trouble thinking right now. Could you please try again in a moment?";
  }
};
