import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-[12px] border border-white/[0.08] bg-surface-high/40 px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-muted transition-all duration-200",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-surface-highest/80",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
