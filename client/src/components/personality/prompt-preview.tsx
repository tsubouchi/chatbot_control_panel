import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  prompt: string;
};

export default function PromptPreview({ prompt }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">システムプロンプト</h3>
      </div>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
      </ScrollArea>
    </div>
  );
}