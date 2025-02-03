import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Props = {
  value: {
    empathy: number;
    creativity: number;
    logic: number;
    curiosity: number;
    confidence: number;
  };
  onChange: (key: string, value: number) => void;
};

const SLIDERS = [
  { key: "empathy" as const, label: "平和と調和性" },
  { key: "creativity" as const, label: "創造性" },
  { key: "logic" as const, label: "論理的思考と正確性" },
  { key: "curiosity" as const, label: "新規性" },
  { key: "confidence" as const, label: "慎重さと安全性" },
] as const;

export default function SliderGroup({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      {SLIDERS.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between">
            <Label>{label}</Label>
            <span className="text-sm text-muted-foreground">
              {value[key]}%
            </span>
          </div>
          <Slider
            value={[value[key]]}
            onValueChange={([val]) => onChange(key, val)}
            min={0}
            max={100}
            step={1}
          />
        </div>
      ))}
    </div>
  );
}