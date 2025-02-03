import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import SliderGroup from "@/components/personality/slider-group";
import TextInputGroup from "@/components/personality/text-input-group";
import PromptPreview from "@/components/personality/prompt-preview";
import { useSocket } from "@/lib/socket";
import { useToast } from "@/hooks/use-toast";
import { generateSystemPrompt } from "@/lib/personality";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const socket = useSocket();
  const { toast } = useToast();

  const [personality, setPersonality] = useState({
    empathy: 50,
    creativity: 50,
    logic: 50,
    curiosity: 50,
    confidence: 50,
    traits: "",
  });

  const { data: systemPrompt, refetch: regeneratePrompt } = useQuery({
    queryKey: ["/api/prompt", personality],
    enabled: false,
  });

  const handleSendMessage = (content: string) => {
    if (!socket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsThinking(true);

    socket.emit("message", { content, systemPrompt });
  };

  const handlePersonalityChange = (
    key: keyof typeof personality,
    value: number | string,
  ) => {
    setPersonality((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegeneratePrompt = async () => {
    await regeneratePrompt();
    toast({
      title: "System prompt regenerated",
      description: "The chatbot's personality has been updated.",
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Personality Chat
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Personality Settings</h2>
          <Tabs defaultValue="sliders">
            <TabsList className="mb-4">
              <TabsTrigger value="sliders">Core Values</TabsTrigger>
              <TabsTrigger value="traits">Traits</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="sliders">
              <SliderGroup value={personality} onChange={handlePersonalityChange} />
            </TabsContent>
            <TabsContent value="traits">
              <TextInputGroup value={personality} onChange={handlePersonalityChange} />
            </TabsContent>
            <TabsContent value="preview">
              <PromptPreview
                prompt={systemPrompt}
                onRegenerate={handleRegeneratePrompt}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Chat</h2>
          <div className="h-[600px] flex flex-col">
            <MessageList messages={messages} isThinking={isThinking} />
            <MessageInput onSend={handleSendMessage} disabled={isThinking} />
          </div>
        </Card>
      </div>
    </div>
  );
}
