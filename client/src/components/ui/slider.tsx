import * as React from "react";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className = "w-full", ...rest }: SliderProps) {
  const current = value?.[0] ?? 0;
  const clamped = Math.min(max, Math.max(min, current));
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className={`relative ${className}`} {...rest}>
      {/* Visible custom track */}
      <div
        className="relative rounded-full h-[8px]"
        style={{ background: "rgba(255, 107, 107, 0.2)" }}
      >
        <div
          className="absolute left-0 top-0 h-[8px] rounded-full"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #FF6B6B 0%, #FF8787 50%, #FFA3A3 100%)",
            boxShadow: "0 0 14px rgba(255, 107, 107, 0.5)",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2"
          style={{
            left: `calc(${percent}% - 12px)`,
            borderColor: "#FF6B6B",
            boxShadow: "0 0 0 2px #FF6B6B, 0 8px 20px rgba(255, 107, 107, 0.3)",
          }}
        />
      </div>
      {/* Transparent native input overlay for accessibility and keyboard support */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="absolute inset-0 h-6 w-full appearance-none bg-transparent cursor-pointer opacity-0"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
      />
    </div>
  );
}

export default Slider;
