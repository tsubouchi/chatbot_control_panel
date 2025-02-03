import { ScrollArea } from "@/components/ui/scroll-area";
import Typewriter from "./typewriter";
import type { Message } from "@/pages/chat";

type Props = {
  messages: Message[];
  isThinking: boolean;
};

export default function MessageList({ messages, isThinking }: Props) {
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
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <Typewriter text="Thinking..." />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
