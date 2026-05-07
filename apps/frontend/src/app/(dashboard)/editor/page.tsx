"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2, Hand, Square, Circle, Type, Grid3x3, ZoomIn, ZoomOut,
  Undo2, Redo2, Save, Layers, MonitorSmartphone, BookOpen, Users,
  Trash2, RotateCw, Maximize, Minimize, ChevronDown, Loader2, FolderOpen
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssets, useTemplates } from "@/hooks/use-queries";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { PlacedElement, Template, BackgroundTheme } from "@/types";
import { TopDownAssetRenderer } from "@/components/editor/top-down-asset-renderer";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { AssetPanel } from "@/components/editor/asset-panel";
import { EditorHeader } from "@/components/editor/editor-header";
import { CanvasBackground } from "@/components/editor/canvas-background";
import { useSaveCanvas, useLoadCanvas, useCanvases } from "@/hooks/use-canvas";
import { EDITOR_TOOLS, BG_OPTIONS, GRID_SIZE, EDITOR_CATEGORIES } from "@/constants/strings";
export default function EditorPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const [activeTool, setActiveTool] = useState("Select");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('dark-tiles');
  const [bgColor, setBgColor] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [canvasName, setCanvasName] = useState("Untitled Space");
  const [canvasDescription, setCanvasDescription] = useState("");
  const [canvasId, setCanvasId] = useState(`space_${Date.now()}`);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const { saveCanvas, isSaving } = useSaveCanvas();
  const { loadCanvas, isLoading: isCanvasLoading } = useLoadCanvas();
  const { canvases, fetchCanvases } = useCanvases();

  // Load the canvas from URL param (?id=xxx) or start fresh
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (!idFromUrl) return; // new space — start with blank canvas

    const init = async () => {
      const data = await loadCanvas(idFromUrl);
      if (data) {
        setPlacedElements(data.elements);
        setBgTheme(data.bgTheme);
        setBgColor(data.bgColor);
        if (data.name) setCanvasName(data.name);
        if (data.description) setCanvasDescription(data.description);
        setCanvasId(data.id);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBgDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };


  const filteredAssets = activeCategory === "all" ? assets : assets?.filter((a) => a.category === activeCategory);

  const loadTemplate = (template: Template) => {
    setPlacedElements(template.elements);
    setSelectedElementId(null);
    if (template.bgTheme) setBgTheme(template.bgTheme);
    setPan({ x: 100, y: 50 });
    setZoom(1);
  };

  const isOverlapping = (newX: number, newY: number, assetId: string, rotation: number, ignoreId?: string) => {
    if (!assets) return false;
    const newAsset = assets.find(a => a.id === assetId);
    if (!newAsset || newAsset.category === "zone") return false;

    // Calculate AABB based on center-origin rotation
    const getBounds = (x: number, y: number, w: number, h: number, rot: number) => {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const isRotated = (rot || 0) % 180 !== 0;
      const finalW = isRotated ? h : w;
      const finalH = isRotated ? w : h;
      return {
        left: cx - finalW / 2,
        right: cx + finalW / 2,
        top: cy - finalH / 2,
        bottom: cy + finalH / 2
      };
    };

    const newBounds = getBounds(newX, newY, newAsset.width, newAsset.height, rotation);

    return placedElements.some((el) => {
      if (el.id === ignoreId) return false;
      const elAsset = assets.find(a => a.id === el.assetId);
      if (!elAsset || elAsset.category === "zone") return false;

      const elBounds = getBounds(el.x, el.y, elAsset.width, elAsset.height, el.rotation || 0);

      return (
        newBounds.left < elBounds.right &&
        newBounds.right > elBounds.left &&
        newBounds.top < elBounds.bottom &&
        newBounds.bottom > elBounds.top
      );
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData("assetId");
    if (!assetId || !assets) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) - pan.x) / (GRID_SIZE * zoom));
    const y = Math.floor(((e.clientY - rect.top) - pan.y) / (GRID_SIZE * zoom));

    if (isOverlapping(x, y, assetId, 0)) {
      return; // Cannot drop here
    }

    setPlacedElements((prev) => [
      ...prev,
      {
        id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        assetId,
        x,
        y,
        rotation: 0,
      },
    ]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateElementPosition = (id: string, x: number, y: number) => {
    setPlacedElements((prev) => {
      const el = prev.find(e => e.id === id);
      if (!el || isOverlapping(x, y, el.assetId, el.rotation || 0, id)) {
        return prev; // Snap back if invalid
      }
      return prev.map((e) => (e.id === id ? { ...e, x, y } : e));
    });
  };

  const rotateElement = (id: string) => {
    setPlacedElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, rotation: ((el.rotation || 0) + 90) % 360 } : el))
    );
  };

  const removeElement = (id: string) => {
    setPlacedElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "Pan" || e.button === 1 || e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
    } else if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setSelectedElementId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const bgSize = `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`;
  const bgPos = `${pan.x}px ${pan.y}px`;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <EditorHeader
        bgTheme={bgTheme} setBgTheme={setBgTheme}
        bgColor={bgColor} setBgColor={setBgColor}
        isBgDropdownOpen={isBgDropdownOpen} setIsBgDropdownOpen={setIsBgDropdownOpen}
        dropdownRef={dropdownRef}
        canvasName={canvasName} setCanvasName={setCanvasName}
        setCanvasDescription={setCanvasDescription} setCanvasId={setCanvasId}
        setPlacedElements={setPlacedElements}
        isSaving={isSaving} setIsSaveModalOpen={setIsSaveModalOpen}
        setIsLoadModalOpen={setIsLoadModalOpen} fetchCanvases={fetchCanvases}
      />

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Toolbar */}
        <EditorToolbar
          tools={EDITOR_TOOLS}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          setZoom={setZoom}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />

        {/* Canvas */}
        <div 
          ref={containerRef}
          className={`flex-1 glass-card-static rounded-2xl relative overflow-hidden border border-[#2F2F2F] bg-black ${isPanning ? 'cursor-grabbing' : (activeTool === 'Pan' ? 'cursor-grab' : 'cursor-default')}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <CanvasBackground bgTheme={bgTheme} bgColor={bgColor} bgSize={bgSize} bgPos={bgPos} />

          {/* Render Placed Elements */}
          <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            {assets && placedElements.map((el) => {
              const asset = assets.find((a) => a.id === el.assetId);
              if (!asset) return null;
              
              const isSelected = selectedElementId === el.id;
              // Calculate dimensions based on rotation
              const isRotated = (el.rotation || 0) % 180 !== 0;
              // The bounds of the element frame don't change width/height variables directly 
              // since rotation is applied via CSS transform. 
              // However, visually the bounding box rotates, so we just set standard w/h.
              const w = asset.width * GRID_SIZE;
              const h = asset.height * GRID_SIZE;

              return (
                <motion.div
                  key={el.id}
                  className={`absolute cursor-move border-2 ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(109,59,215,0.5)] z-50' : 'border-transparent'} pointer-events-auto`}
                  style={{
                    left: el.x * GRID_SIZE,
                    top: el.y * GRID_SIZE,
                    width: w,
                    height: h,
                    transformOrigin: "center center",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: el.rotation || 0 }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                    rotate: { type: "spring", stiffness: 200, damping: 20 }
                  }}
                  drag
                  dragMomentum={false}
                  dragSnapToOrigin={true}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 50 }}
                  onDragEnd={(event, info) => {
                    const newX = Math.round((el.x * GRID_SIZE + info.offset.x / zoom) / GRID_SIZE);
                    const newY = Math.round((el.y * GRID_SIZE + info.offset.y / zoom) / GRID_SIZE);
                    updateElementPosition(el.id, newX, newY);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  whileHover={{ filter: "drop-shadow(0 0 8px rgba(109,59,215,0.5))" }}
                >
                  <TopDownAssetRenderer asset={asset} customColor={el.customColor} />
                  
                  {/* Selection Controls */}
                  {isSelected && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-surface-highest rounded-lg p-1.5 shadow-xl z-50">
                      <div className="flex items-center justify-center p-1 hover:bg-surface-low rounded cursor-pointer" title="Custom Color">
                        <input
                          type="color"
                          value={el.customColor || '#ffffff'}
                          onChange={(e) => {
                            e.stopPropagation();
                            setPlacedElements((prev) => prev.map(p => p.id === el.id ? { ...p, customColor: e.target.value } : p));
                          }}
                          className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
                        />
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); rotateElement(el.id); }} className="p-1 hover:bg-surface-low rounded text-on-surface cursor-pointer" title="Rotate">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="p-1 hover:bg-error/20 text-error rounded cursor-pointer" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 glass-panel rounded-lg px-3 py-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-on-surface">{activeTool} Tool (Drag assets here)</span>
          </div>
        </div>

        {/* Asset Panel */}
        <AssetPanel
          categories={EDITOR_CATEGORIES}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          showTemplates={showTemplates}
          setShowTemplates={setShowTemplates}
          assetsLoading={assetsLoading}
          filteredAssets={filteredAssets}
          templatesLoading={templatesLoading}
          templates={templates}
          loadTemplate={loadTemplate}
        />
      </div>

      {/* Load Modal */}
      <AnimatePresence>
        {isLoadModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md glass-card-static p-6 rounded-2xl flex flex-col gap-4 border border-white/[0.08] shadow-2xl"
            >
              <h2 className="text-xl font-bold text-on-surface">Load Canvas</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {canvases.length === 0 ? (
                  <p className="text-on-surface-muted text-sm text-center py-4">No saved canvases found.</p>
                ) : (
                  canvases.map(c => (
                    <div 
                      key={c.id} 
                      className="p-3 rounded-xl hover:bg-surface-high transition-colors cursor-pointer border border-transparent hover:border-white/[0.05]"
                      onClick={() => {
                        setPlacedElements(c.elements);
                        setBgTheme(c.bgTheme);
                        setBgColor(c.bgColor);
                        setCanvasName(c.name || "Untitled Space");
                        setCanvasDescription(c.description || "");
                        setCanvasId(c.id);
                        setIsLoadModalOpen(false);
                      }}
                    >
                      <h3 className="font-medium text-on-surface">{c.name || "Untitled Space"}</h3>
                      <p className="text-xs text-on-surface-muted mt-1">{new Date(c.updatedAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-end pt-2 border-t border-white/[0.06]">
                <Button variant="ghost" onClick={() => setIsLoadModalOpen(false)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md glass-card-static p-6 rounded-2xl flex flex-col gap-4 border border-white/[0.08] shadow-2xl"
            >
              <h2 className="text-xl font-bold text-on-surface">Save Space</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Name</label>
                  <Input 
                    value={canvasName} 
                    onChange={(e) => setCanvasName(e.target.value)} 
                    placeholder="Enter space name"
                    autoFocus
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                  <textarea 
                    value={canvasDescription} 
                    onChange={(e) => setCanvasDescription(e.target.value)} 
                    className="w-full h-24 rounded-xl bg-surface-high/50 border border-outline-variant px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                    placeholder="Enter a short description for this space..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
                <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
                <Button 
                  variant="gradient" 
                  onClick={async () => {
                    await saveCanvas({ 
                      id: canvasId, 
                      name: canvasName, 
                      description: canvasDescription, 
                      bgTheme, 
                      bgColor, 
                      elements: placedElements, 
                      updatedAt: Date.now() 
                    });
                    // Invalidate the spaces list so /spaces shows the update immediately
                    queryClient.invalidateQueries({ queryKey: ["spaces"] });
                    setIsSaveModalOpen(false);
                  }}
                  disabled={isSaving || !canvasName.trim()}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                  {isSaving ? "Saving..." : "Save Space"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
