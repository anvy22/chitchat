"use client";

import { HTMLAttributes } from "react";

interface ColorPickerGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ColorPickerGroup({ colors, value, onChange, size = "md", className = "", ...props }: ColorPickerGroupProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10"
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} {...props}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`${sizeClasses[size]} rounded-full transition-all cursor-pointer shrink-0 ${
            value === color
              ? "ring-2 ring-white ring-offset-2 ring-offset-surface-container shadow-[0_0_12px_rgba(109,59,215,0.6)]"
              : "hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 hover:ring-offset-surface-container hover:shadow-[0_0_8px_rgba(109,59,215,0.3)]"
          }`}
          style={{ backgroundColor: color }}
          type="button"
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
