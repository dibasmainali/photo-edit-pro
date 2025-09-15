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
        className="relative rounded-full h-[8px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ background: "#7c3aed55" }}
      >
        <div
          className="absolute left-0 top-0 h-[8px] rounded-full"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%)",
            boxShadow: "0 0 14px #8b5cf680",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white"
          style={{
            left: `calc(${percent}% - 10px)`,
            boxShadow: "0 0 0 2px #8b5cf6, 0 8px 20px #8b5cf680",
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
