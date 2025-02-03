import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";

type Props = {
  prompt?: string;
  onRegenerate: () => void;
};

export default function PromptPreview({ prompt, onRegenerate }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">System Prompt</h3>
        <Button onClick={onRegenerate} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
      </ScrollArea>
    </div>
  );
}
