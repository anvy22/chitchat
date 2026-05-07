"use client";

import { HTMLAttributes } from "react";

interface PillOption {
  value: string;
  label?: string;
}

interface PillGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: (string | PillOption)[];
  value: string;
  onChange: (value: string) => void;
  capitalize?: boolean;
}

export function PillGroup({ options, value, onChange, capitalize = false, className = "", ...props }: PillGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`} {...props}>
      {options.map((opt) => {
        const optValue = typeof opt === "string" ? opt : opt.value;
        const optLabel = typeof opt === "string" ? opt : (opt.label || opt.value);
        
        return (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${capitalize ? 'capitalize' : ''} ${
              value === optValue
                ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                : "bg-surface-high/40 text-on-surface-muted hover:text-on-surface hover:bg-surface-highest"
            }`}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
