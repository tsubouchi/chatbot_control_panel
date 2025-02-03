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
  { key: "empathy", label: "Empathy" },
  { key: "creativity", label: "Creativity" },
  { key: "logic", label: "Logic" },
  { key: "curiosity", label: "Curiosity" },
  { key: "confidence", label: "Confidence" },
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
