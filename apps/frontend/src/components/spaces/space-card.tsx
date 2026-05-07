import Link from "next/link";
import { Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { formatRelativeTime } from "@/lib/utils";
import type { Space } from "@/types";

interface SpaceCardProps {
  space: Space;
  theme: { color: string; name: string };
  onDeleteClick: (id: string, name: string) => void;
}

export function SpaceCard({ space, theme, onDeleteClick }: SpaceCardProps) {
  return (
    <div className="group relative h-full">
      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl z-0"
        style={{ backgroundColor: `${theme.color}20` }}
      />

      <div className="block h-full relative z-10">
        <GlassCard
          className="p-6 h-full flex flex-col transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 hover:border-opacity-100"
          style={{
            border: `1px solid ${theme.color}40`,
            boxShadow: `0 8px 30px -4px ${theme.color}25`,
          }}
        >
          {/* Subtle top gradient accent */}
          <div
            className="absolute top-0 left-0 right-0 h-32 opacity-[0.15] pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
            style={{ background: `linear-gradient(180deg, ${theme.color} 0%, transparent 100%)` }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.color}30, ${theme.color}10)`,
                  borderColor: `${theme.color}40`,
                  color: theme.color,
                  boxShadow: `0 4px 12px -2px ${theme.color}40`,
                }}
              >
                <span className="text-3xl drop-shadow-sm">{space.thumbnail}</span>
              </div>
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteClick(space.id, space.name);
                }}
                className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/15 text-on-surface-muted hover:text-red-400 cursor-pointer"
                title="Delete space"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <Link href={`/spaces/${space.id}`} className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-on-surface mb-2 transition-colors duration-300">
                {space.name}
              </h3>

              <p className="text-sm text-on-surface-muted line-clamp-2 mb-6 flex-1 leading-relaxed">
                {space.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <span className="text-xs text-on-surface-muted/60 font-medium tracking-wide uppercase">
                  Custom space
                </span>
                <p className="text-[11px] text-on-surface-muted">{formatRelativeTime(space.lastActive)}</p>
              </div>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
