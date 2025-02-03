import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import OpenAI from "openai";
import { db } from "@db";
import { messages, personalities } from "@db/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    path: "/api/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", async (data) => {
      try {
        // Store user message
        await db.insert(messages).values({
          content: data.content,
          role: "user",
        });

        // Generate response using OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: data.systemPrompt,
            },
            {
              role: "user",
              content: data.content,
            },
          ],
        });

        const response = completion.choices[0].message.content;

        // Store AI response
        await db.insert(messages).values({
          content: response,
          role: "assistant",
        });

        socket.emit("message", {
          content: response,
          role: "assistant",
        });
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", "メッセージの処理中にエラーが発生しました");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return httpServer;
}