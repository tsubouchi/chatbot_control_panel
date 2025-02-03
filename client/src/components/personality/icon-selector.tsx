import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DEFAULT_ICONS = [
  { id: "1", path: "/icons/ai-1.png", label: "🤖" },
  { id: "2", path: "/icons/ai-2.png", label: "🎯" },
  { id: "3", path: "/icons/ai-3.png", label: "🌟" },
  { id: "4", path: "/icons/ai-4.png", label: "💡" },
  { id: "5", path: "/icons/ai-5.png", label: "🎨" },
  { id: "6", path: "/icons/ai-6.png", label: "📚" },
  { id: "7", path: "/icons/ai-7.png", label: "🔧" },
  { id: "8", path: "/icons/ai-8.png", label: "🎮" },
  { id: "9", path: "/icons/ai-9.png", label: "🌈" },
  { id: "10", path: "/icons/ai-10.png", label: "🎵" },
];

type Props = {
  selectedIcon: string;
  onSelect: (iconPath: string) => void;
};

export default function IconSelector({ selectedIcon, onSelect }: Props) {
  const [customIcon, setCustomIcon] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomIcon(base64);
        onSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>アイコン</Label>
      <div className="grid grid-cols-5 gap-4">
        {DEFAULT_ICONS.map((icon) => (
          <button
            key={icon.id}
            onClick={() => onSelect(icon.path)}
            className={`p-2 rounded-lg transition-all ${
              selectedIcon === icon.path
                ? "ring-2 ring-primary bg-primary/10"
                : "hover:bg-muted"
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center text-2xl">
              {icon.label}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <Label>画像をアップロード</Label>
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById("icon-upload")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            ファイルを選択
          </Button>
          <input
            type="file"
            id="icon-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {customIcon && (
            <Avatar>
              <AvatarImage src={customIcon} alt="Custom icon" />
              <AvatarFallback>CI</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
