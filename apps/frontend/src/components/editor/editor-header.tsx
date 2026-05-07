import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2, FolderOpen, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BG_OPTIONS } from "@/constants/strings";
import type { BackgroundTheme } from "@/types";

interface EditorHeaderProps {
  bgTheme: BackgroundTheme;
  setBgTheme: (theme: BackgroundTheme) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  isBgDropdownOpen: boolean;
  setIsBgDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  canvasName: string;
  setCanvasName: (name: string) => void;
  setCanvasDescription: (desc: string) => void;
  setCanvasId: (id: string) => void;
  setPlacedElements: (elements: any[]) => void;
  isSaving: boolean;
  setIsSaveModalOpen: (open: boolean) => void;
  setIsLoadModalOpen: (open: boolean) => void;
  fetchCanvases: () => void;
}

export function EditorHeader({
  bgTheme, setBgTheme,
  bgColor, setBgColor,
  isBgDropdownOpen, setIsBgDropdownOpen,
  dropdownRef,
  canvasName, setCanvasName, setCanvasDescription, setCanvasId,
  setPlacedElements,
  isSaving, setIsSaveModalOpen, setIsLoadModalOpen, fetchCanvases
}: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Space Editor</h1>
        <p className="text-sm text-on-surface-muted">Design your virtual workspace layout</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4 bg-surface-high/30 pl-3 pr-2 py-1.5 rounded-xl relative" ref={dropdownRef}>
          <span className="text-xs text-on-surface-muted">Canvas:</span>
          
          <div 
            className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors select-none"
            onClick={() => setIsBgDropdownOpen(!isBgDropdownOpen)}
          >
            <span className="text-sm font-medium text-on-surface min-w-[75px]">
              {BG_OPTIONS.find(opt => opt.value === bgTheme)?.label || 'Select'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-muted transition-transform duration-200 ${isBgDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isBgDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 mt-1.5 w-40 bg-surface-highest border border-outline-variant shadow-2xl shadow-black/40 rounded-2xl overflow-hidden z-50 flex flex-col py-1.5"
              >
                {BG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`text-left px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-high ${bgTheme === opt.value ? 'text-primary bg-primary/5' : 'text-on-surface'}`}
                    onClick={() => {
                      setBgTheme(opt.value as BackgroundTheme);
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-[1px] h-4 bg-outline-variant mx-1" />

          <div className="relative group flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-high transition-colors">
            <input 
              type="color" 
              value={bgColor || '#000000'} 
              onChange={(e) => setBgColor(e.target.value)}
              className="w-4 h-4 rounded-sm cursor-pointer bg-transparent border-0 p-0 opacity-0 absolute inset-0 z-10"
              title="Custom Canvas Color"
            />
            <div 
              className={`w-4 h-4 rounded-full border border-outline-variant shadow-sm ${!bgColor ? 'bg-gradient-to-br from-gray-200 to-gray-500' : ''}`}
              style={bgColor ? { backgroundColor: bgColor } : {}}
            />
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => {
          setPlacedElements([]);
          setCanvasId(`space_${Date.now()}`);
          setCanvasName("Untitled Space");
          setCanvasDescription("");
        }}>
          <Trash2 className="w-4 h-4 mr-1" /> Clear
        </Button>
        <div className="w-[1px] h-4 bg-outline-variant mx-1" />
        
        <div className="flex items-center bg-surface-high/30 rounded-xl px-3 py-1.5 border border-white/[0.04]">
          <span className="text-sm font-medium text-on-surface truncate max-w-[150px]">{canvasName}</span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => {
          fetchCanvases();
          setIsLoadModalOpen(true);
        }}>
          <FolderOpen className="w-4 h-4 mr-1" /> Load
        </Button>

        <Button 
          variant="gradient" 
          size="sm" 
          onClick={() => setIsSaveModalOpen(true)}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />} 
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
