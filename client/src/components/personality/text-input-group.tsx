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
        <Label>Personality Traits</Label>
        <Textarea
          value={value.traits}
          onChange={(e) => onChange("traits", e.target.value)}
          placeholder="Enter personality traits (e.g., friendly, analytical, humorous)"
          className="h-[200px]"
        />
      </div>
    </div>
  );
}
