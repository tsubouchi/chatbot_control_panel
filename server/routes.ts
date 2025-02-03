import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { db } from "@db";
import { messages, personalities } from "@db/schema";
import { generateSystemPrompt } from "../client/src/lib/personality";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    path: "/api/socket.io",
  });

  app.get("/api/prompt", async (req, res) => {
    const { empathy, creativity, logic, curiosity, confidence, traits } = req.query;
    
    const prompt = generateSystemPrompt({
      empathy: Number(empathy),
      creativity: Number(creativity),
      logic: Number(logic),
      curiosity: Number(curiosity),
      confidence: Number(confidence),
      traits: String(traits),
    });

    res.json(prompt);
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

        // Simulate AI thinking time
        setTimeout(async () => {
          // Generate response based on system prompt
          const response = `This is a simulated response. The actual integration with an LLM would go here. System prompt used: ${data.systemPrompt}`;

          // Store AI response
          await db.insert(messages).values({
            content: response,
            role: "assistant",
          });

          socket.emit("message", {
            content: response,
            role: "assistant",
          });
        }, 1000);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", "Failed to process message");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return httpServer;
}
