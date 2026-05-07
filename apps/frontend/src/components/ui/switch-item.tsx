"use client";

import { HTMLAttributes } from "react";

interface SwitchItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchItem({ label, description, checked, onChange, className = "", ...props }: SwitchItemProps) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 ${className}`} {...props}>
      <div className="pr-4">
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description && <p className="text-xs text-on-surface-muted mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className="w-10 h-5 bg-surface-highest rounded-full peer peer-checked:bg-primary/60 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5 shadow-inner" />
      </label>
    </div>
  );
}
