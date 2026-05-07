"use client";

import { ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";

interface ToolbarTool {
  icon: React.ElementType;
  label: string;
}

interface EditorToolbarProps {
  tools: ToolbarTool[];
  activeTool: string;
  setActiveTool: (tool: string) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function EditorToolbar({
  tools,
  activeTool,
  setActiveTool,
  setZoom,
  toggleFullscreen,
  isFullscreen,
}: EditorToolbarProps) {
  return (
    <div className="glass-card-static rounded-2xl p-2 flex flex-col gap-1 self-start">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={() => setActiveTool(tool.label)}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            activeTool === tool.label
              ? "bg-primary/15 text-primary"
              : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40"
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}
      <div className="border-t border-white/[0.06] my-1" />
      <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="p-2.5 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 transition-all cursor-pointer" title="Zoom In">
        <ZoomIn className="w-5 h-5" />
      </button>
      <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="p-2.5 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 transition-all cursor-pointer" title="Zoom Out">
        <ZoomOut className="w-5 h-5" />
      </button>
      <div className="border-t border-white/[0.06] my-1" />
      <button 
        onClick={toggleFullscreen}
        className="p-2.5 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 transition-all cursor-pointer" 
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>
    </div>
  );
}
