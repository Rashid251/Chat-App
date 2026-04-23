import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";
import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import {
  emitLastMessageToParticipants,
  emitNewMessageToChatRoom,
} from "../lib/socket";
import UserModel from "../models/user.model";
import { generateAIResponse } from "./ai.service";

export const sendMessageService = async (
  userId: string,
  body: {
    chatId: string;
    content?: string;
    image?: string;
    replyToId?: string;
  }
) => {
  const { chatId, content, image, replyToId } = body;

  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  }).populate("participants");

  if (!chat) throw new BadRequestException("Chat not found or unauthorized");

  const aiParticipant = (chat.participants as any[]).find((p) => p.isAI);

  if (replyToId) {
    const replyMessage = await MessageModel.findOne({
      _id: replyToId,
      chatId,
    });
    if (!replyMessage) throw new NotFoundException("Reply message not found");
  }

  let imageUrl;

  if (image) {
    //upload the image to cloudinary
    const uploadRes = await cloudinary.uploader.upload(image);
    imageUrl = uploadRes.secure_url;
  }

  const newMessage = await MessageModel.create({
    chatId,
    sender: userId,
    content,
    image: imageUrl,
    replyTo: replyToId || null,
  });

  await newMessage.populate([
    { path: "sender", select: "name avatar" },
    {
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    },
  ]);

  chat.lastMessage = newMessage._id as mongoose.Types.ObjectId;
  await chat.save();

  //websocket emit the new Message to the chat room
  emitNewMessageToChatRoom(userId, chatId, newMessage);

  //websocket emit the lastmessage to members (personnal room user)
  const allParticipantIds = chat.participants.map((id) => id._id.toString());
  emitLastMessageToParticipants(allParticipantIds, chatId, newMessage);

  // If AI is a participant, trigger AI response
  if (aiParticipant && content) {
    (async () => {
      try {
        // Fetch last 10 messages for context
        const lastMessages = await MessageModel.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate("sender", "isAI");

        let history = lastMessages
          .reverse()
          .filter((msg) => msg.content) // Only include text messages
          .map((msg) => ({
            role: ((msg.sender as any).isAI ? "model" : "user") as
              | "model"
              | "user",
            parts: [{ text: msg.content! }],
          }));

        // The last message in history is the one we just sent
        const currentMessage = history.pop();
        const prompt = currentMessage?.parts[0].text || content;

        // Gemini history MUST alternate between "user" and "model"
        let alternatingHistory: {
          role: "user" | "model";
          parts: { text: string }[];
        }[] = [];
        for (const entry of history) {
          if (
            alternatingHistory.length > 0 &&
            alternatingHistory[alternatingHistory.length - 1].role ===
              entry.role
          ) {
            alternatingHistory[alternatingHistory.length - 1].parts[0].text +=
              "\n" + entry.parts[0].text;
          } else {
            alternatingHistory.push(entry);
          }
        }

        // Gemini history MUST start with a "user" message
        while (
          alternatingHistory.length > 0 &&
          alternatingHistory[0].role !== "user"
        ) {
          alternatingHistory.shift();
        }

        const aiResponse = await generateAIResponse(prompt, alternatingHistory);

        const aiMessage = await MessageModel.create({
          chatId,
          sender: aiParticipant._id,
          content: aiResponse,
        });

        await aiMessage.populate([{ path: "sender", select: "name avatar" }]);

        chat.lastMessage = aiMessage._id as mongoose.Types.ObjectId;
        await chat.save();

        emitNewMessageToChatRoom(
          aiParticipant._id.toString(),
          chatId,
          aiMessage
        );
        emitLastMessageToParticipants(allParticipantIds, chatId, aiMessage);
      } catch (error) {
        console.error("AI Response error:", error);
      }
    })();
  }

  return {
    userMessage: newMessage,
    chat,
  };
};
