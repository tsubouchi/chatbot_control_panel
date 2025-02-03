import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Typewriter from "./typewriter";
import type { Message } from "@/pages/chat";

type Props = {
  messages: Message[];
  isThinking: boolean;
  botName: string;
  botIcon: string;
};

export default function MessageList({ messages, isThinking, botName, botIcon }: Props) {
  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={botIcon} alt={botName} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.role === "assistant" ? (
                <Typewriter text={message.content} />
              ) : (
                message.content
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={botIcon} alt={botName} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <Typewriter text="考え中..." />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}