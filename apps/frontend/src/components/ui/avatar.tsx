"use client";

import { cn, getStatusColor } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  status?: "online" | "away" | "busy" | "offline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function Avatar({ initials, status, size = "md", className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-semibold text-white",
          sizeClasses[size]
        )}
      >
        {initials}
      </div>
      {status && status !== "offline" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-surface",
            getStatusColor(status),
            size === "sm" ? "w-2.5 h-2.5" : size === "md" ? "w-3 h-3" : "w-4 h-4",
            status === "online" && "animate-pulse-glow"
          )}
        />
      )}
    </div>
  );
}
