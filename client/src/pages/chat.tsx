import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import SliderGroup from "@/components/personality/slider-group";
import TextInputGroup from "@/components/personality/text-input-group";
import PromptPreview from "@/components/personality/prompt-preview";
import NameInput from "@/components/personality/name-input";
import IconSelector from "@/components/personality/icon-selector";
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
  const [isChatbotCreated, setIsChatbotCreated] = useState(false);
  const socket = useSocket();
  const { toast } = useToast();

  const [personality, setPersonality] = useState({
    name: "Sakuraアシスタント",
    icon: "/icons/ai-1.png",
    empathy: 100,
    creativity: 100,
    logic: 70,
    curiosity: 40,
    confidence: 30,
    traits: "",
  });

  const systemPrompt = generateSystemPrompt(personality);

  const handleSendMessage = (content: string) => {
    if (!socket || !isChatbotCreated) return;

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

  const handleCreateChatbot = () => {
    setIsChatbotCreated(true);
    toast({
      title: "チャットボットを作成しました",
      description: "設定した性格でチャットを開始できます。",
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          AIアシスタントをカスタマイズ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-[#25262b] border-0">
              <h2 className="text-2xl font-semibold mb-6">基本設定</h2>
              <div className="space-y-6">
                <NameInput
                  value={personality.name}
                  onChange={(value) => handlePersonalityChange("name", value)}
                />
                <IconSelector
                  selectedIcon={personality.icon}
                  onSelect={(value) => handlePersonalityChange("icon", value)}
                />
              </div>
            </Card>

            <Card className="p-6 bg-[#25262b] border-0">
              <h2 className="text-2xl font-semibold mb-6">主要な価値観</h2>
              <SliderGroup value={personality} onChange={handlePersonalityChange} />
            </Card>

            <Card className="p-6 bg-[#25262b] border-0">
              <h2 className="text-2xl font-semibold mb-6">性格特性</h2>
              <TextInputGroup value={personality} onChange={handlePersonalityChange} />
            </Card>

            <Card className="p-6 bg-[#25262b] border-0">
              <h2 className="text-2xl font-semibold mb-6">システムプロンプト</h2>
              <PromptPreview prompt={systemPrompt} />
            </Card>

            {!isChatbotCreated && (
              <Button 
                onClick={handleCreateChatbot} 
                className="w-full"
                size="lg"
                variant="default"
              >
                この性格でチャットボットを作成
              </Button>
            )}
          </div>

          <Card className="p-6 bg-[#25262b] border-0">
            <h2 className="text-2xl font-semibold mb-6">チャット</h2>
            {isChatbotCreated ? (
              <div className="h-[600px] flex flex-col">
                <MessageList
                  messages={messages}
                  isThinking={isThinking}
                  botName={personality.name}
                  botIcon={personality.icon}
                />
                <MessageInput onSend={handleSendMessage} disabled={isThinking} />
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                プレビューで性格を確認し、チャットボットを作成してください
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}