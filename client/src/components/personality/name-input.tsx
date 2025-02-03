import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function NameInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>チャットボットの名前</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例：Sakuraアシスタント"
      />
    </div>
  );
}
