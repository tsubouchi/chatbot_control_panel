import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  value: {
    traits: string;
  };
  onChange: (key: string, value: string) => void;
};

export default function TextInputGroup({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>性格特性</Label>
        <Textarea
          value={value.traits}
          onChange={(e) => onChange("traits", e.target.value)}
          placeholder="性格特性を入力してください（例：フレンドリー、分析的、ユーモアがある）"
          className="h-[200px]"
        />
      </div>
    </div>
  );
}