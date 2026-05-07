"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
  Settings,
  Users,
  MessageSquare,
  ChevronLeft,
  Pencil,
  Maximize,
  Minimize,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpace, useMessages, useAssets, useCanvasData } from "@/hooks/use-queries";
import { formatRelativeTime } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { TopDownAssetRenderer } from "@/components/editor/top-down-asset-renderer";
import { ChatPanel } from "@/components/spaces/chat-panel";
import { RoomHeader } from "@/components/spaces/room-header";
import type { BackgroundTheme, AvatarState, ElementAction, PlacedElement, Asset } from "@/types";

const GRID_SIZE = 40;
const AVATAR_SIZE = 32;
const MOVE_SPEED = 3;
const PROXIMITY_RANGE = 60; // pixels — how close the avatar must be to interact

/** Get the actions for a placed element (per-instance overrides or asset defaults). */
function getElementActions(el: PlacedElement, asset: Asset | undefined): ElementAction[] {
  if (el.actions && el.actions.length > 0) return el.actions;
  return asset?.defaultActions || [];
}

// Background renderer helper
function getCanvasBg(theme: BackgroundTheme, bgColor: string) {
  const styles: Record<BackgroundTheme, React.CSSProperties> = {
    "dark-tiles": {
      backgroundColor: bgColor || "#1E1E1E",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.4) 2px, transparent 2px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    "wood-floor": {
      backgroundColor: bgColor || "#8B5A2B",
      backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.2) 2px, transparent 2px), repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    concrete: {
      backgroundColor: bgColor || "#64748B",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    "blue-carpet": {
      backgroundColor: bgColor || "#1E3A8A",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    grass: {
      backgroundColor: bgColor || "#22C55E",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    sand: {
      backgroundColor: bgColor || "#FDE047",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
    marble: {
      backgroundColor: bgColor || "#F8FAFC",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    },
  };
  return styles[theme] || styles["dark-tiles"];
}

export default function SpaceRoomPage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.id as string;
  const { data: space, isLoading: spaceLoading } = useSpace(spaceId);
  const { data: canvasData, isLoading: canvasLoading } = useCanvasData(spaceId);
  const { data: assets } = useAssets();
  const { data: messages, isLoading: messagesLoading } = useMessages(spaceId);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  // Avatar position in pixels
  const [avatarPos, setAvatarPos] = useState({ x: 200, y: 200 });
  const [facing, setFacing] = useState<'down'|'up'|'left'|'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  // ─── Interaction System State ───────────────────────────────────────
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [nearbyElement, setNearbyElement] = useState<{ el: PlacedElement; asset: Asset; actions: ElementAction[] } | null>(null);
  const [sittingOnId, setSittingOnId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sittingOnIdRef = useRef<string | null>(null);
  const lastSittingOnIdRef = useRef<string | null>(null);

  const toggleFullscreen = () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // World dimensions
  const worldW = 100 * GRID_SIZE; // 4000px
  const worldH = 100 * GRID_SIZE; // 4000px

  // ─── Action Execution Engine ──────────────────────────────────────
  const handleAction = useCallback((action: ElementAction, el: PlacedElement, asset: Asset) => {
    switch (action.type) {
      case 'SIT': {
        // Snap avatar to element center and enter sitting state
        const seatX = el.x * GRID_SIZE + (asset.width * GRID_SIZE) / 2 - AVATAR_SIZE / 2;
        const seatY = el.y * GRID_SIZE + (asset.height * GRID_SIZE) / 2 - AVATAR_SIZE / 2;
        setAvatarPos({ x: seatX, y: seatY });
        setAvatarState('sitting');
        setSittingOnId(el.id);
        sittingOnIdRef.current = el.id;
        lastSittingOnIdRef.current = el.id;
        setIsMoving(false);
        break;
      }
      case 'TELEPORT': {
        const targetId = action.payload?.targetRoomId as string | undefined;
        if (targetId) {
          router.push(`/spaces/${targetId}`);
        }
        break;
      }
      case 'SWIM': {
        setAvatarState('swimming');
        break;
      }
      default:
        console.log(`Action type '${action.type}' is not yet implemented.`);
    }
  }, [router]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys when typing in chat input
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        // Break out of sitting when movement keys are pressed
        if (avatarState === 'sitting' || sittingOnIdRef.current) {
          setAvatarState('idle');
          setSittingOnId(null);
          sittingOnIdRef.current = null;
        }
      }
      // Interact key
      if (key === 'e') {
        e.preventDefault();
        if (nearbyElement) {
          const primaryAction = nearbyElement.actions[0];
          if (primaryAction) {
            handleAction(primaryAction, nearbyElement.el, nearbyElement.asset);
          }
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [avatarState, nearbyElement, handleAction]);

  // Game loop
  useEffect(() => {
    const placedElements = canvasData?.elements || [];

    const loop = () => {
      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;

      if (keys.has("arrowleft") || keys.has("a")) dx -= MOVE_SPEED;
      if (keys.has("arrowright") || keys.has("d")) dx += MOVE_SPEED;
      if (keys.has("arrowup") || keys.has("w")) dy -= MOVE_SPEED;
      if (keys.has("arrowdown") || keys.has("s")) dy += MOVE_SPEED;

      const moving = dx !== 0 || dy !== 0;
      setIsMoving(moving);

      if (moving) {
        if (dx < 0) setFacing('left');
        else if (dx > 0) setFacing('right');
        else if (dy < 0) setFacing('up');
        else if (dy > 0) setFacing('down');

        setAvatarPos((prev) => {
          let newX = Math.max(0, Math.min(worldW - AVATAR_SIZE, prev.x + dx));
          let newY = Math.max(0, Math.min(worldH - AVATAR_SIZE, prev.y + dy));

          const getFeetRect = (posX: number, posY: number) => {
            const NAME_TAG_H = 20;
            const CHAR_H = 42;
            const feetCenterX = posX + AVATAR_SIZE / 2;
            const feetBottomY = posY + NAME_TAG_H + CHAR_H;
            return {
              left: feetCenterX - 3,
              right: feetCenterX + 3,
              top: feetBottomY - 4,
              bottom: feetBottomY,
            };
          };

          const isInside = (posX: number, posY: number, el: PlacedElement) => {
            const asset = assets?.find((a) => a.id === el.assetId);
            if (!asset || asset.category === "zone") return false;
            if (el.id === sittingOnIdRef.current) return false;

            let elW = asset.width * GRID_SIZE;
            let elH = asset.height * GRID_SIZE;
            let elLeft = el.x * GRID_SIZE;
            let elTop = el.y * GRID_SIZE;

            if (el.rotation === 90 || el.rotation === 270) {
              const cx = elLeft + elW / 2;
              const cy = elTop + elH / 2;
              elW = asset.height * GRID_SIZE;
              elH = asset.width * GRID_SIZE;
              elLeft = cx - elW / 2;
              elTop = cy - elH / 2;
            }

            const inset = 8;
            const rect = getFeetRect(posX, posY);
            
            return (
              rect.left < (elLeft + elW - inset) &&
              rect.right > (elLeft + inset) &&
              rect.top < (elTop + elH - inset) &&
              rect.bottom > (elTop + inset)
            );
          };

          // Find all elements we are ALREADY overlapping
          const alreadyOverlapping = new Set<string>();
          for (const el of placedElements) {
            if (isInside(prev.x, prev.y, el)) {
              alreadyOverlapping.add(el.id);
            }
          }

          const checkCol = (testPosX: number, testPosY: number) => {
            for (const el of placedElements) {
              if (alreadyOverlapping.has(el.id)) continue; // Allow walking "out" of things we are already in
              if (isInside(testPosX, testPosY, el)) return true;
            }
            return false;
          };

          // Slide along walls logic: test X and Y axes independently
          if (dx !== 0 && checkCol(newX, prev.y)) newX = prev.x;
          if (dy !== 0 && checkCol(newX, newY)) newY = prev.y;

          return { x: newX, y: newY };
        });
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [worldW, worldH, canvasData, assets]);

  // ─── Proximity Detection ─────────────────────────────────────────
  useEffect(() => {
    if (!assets || !canvasData?.elements) {
      setNearbyElement(null);
      return;
    }

    const avatarCenterX = avatarPos.x + AVATAR_SIZE / 2;
    const avatarCenterY = avatarPos.y + AVATAR_SIZE / 2;

    let closest: { el: PlacedElement; asset: Asset; actions: ElementAction[]; dist: number } | null = null;

    for (const el of canvasData.elements) {
      const asset = assets.find((a) => a.id === el.assetId);
      if (!asset) continue;
      const actions = getElementActions(el, asset);
      if (actions.length === 0) continue; // no actions = not interactive

      const elCenterX = el.x * GRID_SIZE + (asset.width * GRID_SIZE) / 2;
      const elCenterY = el.y * GRID_SIZE + (asset.height * GRID_SIZE) / 2;
      const dist = Math.hypot(avatarCenterX - elCenterX, avatarCenterY - elCenterY);

      if (dist < PROXIMITY_RANGE && (!closest || dist < closest.dist)) {
        closest = { el, asset, actions, dist };
      }
    }

    setNearbyElement(closest ? { el: closest.el, asset: closest.asset, actions: closest.actions } : null);

    // Auto-exit swimming when walking away from pool
    if (avatarState === 'swimming' && (!closest || closest.actions[0]?.type !== 'SWIM')) {
      setAvatarState('idle');
    }
    // Auto-enter swimming when near pool
    if (avatarState === 'idle' && closest && closest.actions[0]?.type === 'SWIM') {
      setAvatarState('swimming');
    }
  }, [avatarPos, assets, canvasData, avatarState]);

  // Camera follow avatar
  useEffect(() => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    
    // Calculate target camera position (centered on avatar)
    const targetX = avatarPos.x - vw / 2 + AVATAR_SIZE / 2;
    const targetY = avatarPos.y - vh / 2 + AVATAR_SIZE / 2;

    if (isFullscreen) {
      // In fullscreen, we center the content/avatar even at boundaries for a premium feel
      setCamera({
        x: Math.round(targetX),
        y: Math.round(targetY),
      });
    } else {
      // In windowed mode, clamp to world boundaries to keep it clean within the page
      setCamera({
        x: Math.round(worldW > vw ? Math.max(0, Math.min(worldW - vw, targetX)) : (worldW - vw) / 2),
        y: Math.round(worldH > vh ? Math.max(0, Math.min(worldH - vh, targetY)) : (worldH - vh) / 2),
      });
    }
  }, [avatarPos, worldW, worldH, isFullscreen]);

  if (spaceLoading || canvasLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto" />
          <Skeleton className="h-5 w-40 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-on-surface-muted">Space not found</p>
      </div>
    );
  }

  const bgTheme = canvasData?.bgTheme || "dark-tiles";
  const bgColor = canvasData?.bgColor || "";
  const placedElements = canvasData?.elements || [];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <RoomHeader 
        space={space} 
        spaceId={spaceId} 
        chatOpen={chatOpen} 
        setChatOpen={setChatOpen} 
        isFullscreen={isFullscreen} 
        toggleFullscreen={toggleFullscreen} 
      />

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Virtual Space Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            ref={viewportRef}
            className="flex-1 rounded-2xl relative overflow-hidden border border-[#2F2F2F] bg-black"
            tabIndex={0}
          >
            {/* World container — moves opposite to camera */}
            <div
              className="absolute"
              style={{
                width: worldW,
                height: worldH,
                transform: `translate(${-camera.x}px, ${-camera.y}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              {/* Background - Extended to cover potential negative camera offsets */}
              <div
                className="absolute"
                style={{
                  ...getCanvasBg(bgTheme, bgColor),
                  left: -2000,
                  top: -2000,
                  width: worldW + 4000,
                  height: worldH + 4000,
                }}
              />

              {/* Rendered elements from saved canvas */}
              {assets &&
                placedElements.map((el) => {
                  const asset = assets.find((a) => a.id === el.assetId);
                  if (!asset) return null;
                  const w = asset.width * GRID_SIZE;
                  const h = asset.height * GRID_SIZE;
                  const isNearby = nearbyElement?.el.id === el.id;
                  const elActions = getElementActions(el, asset);
                  const isInteractive = elActions.length > 0;
                  return (
                    <div
                      key={el.id}
                      className={`absolute transition-shadow duration-200 ${isNearby ? 'z-40' : ''}`}
                      style={{
                        left: el.x * GRID_SIZE,
                        top: el.y * GRID_SIZE,
                        width: w,
                        height: h,
                        transform: `rotate(${el.rotation || 0}deg)`,
                        transformOrigin: "center center",
                        boxShadow: isNearby ? '0 0 20px 4px rgba(139, 92, 246, 0.5)' : 'none',
                        borderRadius: isNearby ? '8px' : '0',
                      }}
                    >
                      <TopDownAssetRenderer asset={asset} customColor={el.customColor} />
                      {/* Interaction hint icon on interactive elements */}
                      {isInteractive && !isNearby && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/80 flex items-center justify-center text-[8px] shadow-md animate-pulse">
                          {elActions[0].icon || '⚡'}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Player avatar */}
              <div
                className="absolute z-50 flex flex-col items-center"
                style={{
                  left: avatarPos.x,
                  top: avatarPos.y,
                  transition: "left 0.08s linear, top 0.08s linear",
                }}
              >
                {/* Interaction Prompt */}
                {nearbyElement && avatarState !== 'sitting' && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
                    <div className="bg-primary/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-primary-light/30 flex items-center gap-1">
                      <kbd className="bg-white/20 rounded px-1 py-0.5 text-[8px] font-mono">E</kbd>
                      {nearbyElement.actions[0]?.label || 'Interact'}
                    </div>
                  </div>
                )}

                {/* Name tag */}
                <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 whitespace-nowrap border border-white/10 shadow-lg z-50">
                  Dale
                </div>

                {/* Character container - Gather.town style */}
                <div 
                  className={`relative flex flex-col items-center justify-end ${isMoving ? 'animate-gather-wobble' : ''} ${avatarState === 'sitting' ? 'avatar-sitting' : ''} ${avatarState === 'swimming' ? 'avatar-swimming' : ''}`}
                  style={{ 
                    width: AVATAR_SIZE, 
                    height: avatarState === 'sitting' ? AVATAR_SIZE : AVATAR_SIZE + 10
                  }}
                >
                  {/* Head */}
                  <div className="relative w-[22px] h-[22px] bg-[#FDBCB4] rounded-[8px] border-[1.5px] border-[#E8A090] z-30 flex flex-col items-center overflow-hidden shrink-0 shadow-sm">
                     {/* Hair */}
                     <div className={`w-full bg-[#4A2F1D] absolute top-0 ${facing === 'up' ? 'h-full' : 'h-[8px]'} transition-all`} />
                     
                     {/* Face/Eyes */}
                     {facing !== 'up' && (
                       <div className={`w-full flex mt-[10px] z-10 ${facing === 'right' ? 'justify-end pr-[3px]' : facing === 'left' ? 'justify-start pl-[3px]' : 'justify-center gap-[3px]'}`}>
                         <div className="w-[4px] h-[4px] bg-[#1E293B] rounded-full" />
                         {(facing === 'down') && <div className="w-[4px] h-[4px] bg-[#1E293B] rounded-full" />}
                       </div>
                     )}
                  </div>

                  {/* Body Container */}
                  <div className="relative flex justify-center w-[26px] h-[18px] mt-[-4px] z-20 shrink-0">
                     {/* Left Arm */}
                     <div className={`absolute left-[-2px] top-[4px] w-[6px] h-[12px] bg-[#E8A090] rounded-full z-10 origin-top shadow-sm ${isMoving ? 'animate-arm-swing-left' : ''}`} />
                     {/* Right Arm */}
                     <div className={`absolute right-[-2px] top-[4px] w-[6px] h-[12px] bg-[#E8A090] rounded-full z-10 origin-top shadow-sm ${isMoving ? 'animate-arm-swing-right' : ''}`} />

                     {/* Torso */}
                     <div className="w-[20px] h-[18px] bg-primary rounded-md z-20 shadow-sm" />

                     {/* Legs - hidden when sitting */}
                     {avatarState !== 'sitting' && (
                       <>
                         <div className={`absolute left-[4px] bottom-[-6px] w-[6px] h-[8px] bg-[#1E293B] rounded-full z-10 origin-top ${isMoving ? 'animate-leg-step-left' : ''}`} />
                         <div className={`absolute right-[4px] bottom-[-6px] w-[6px] h-[8px] bg-[#1E293B] rounded-full z-10 origin-top ${isMoving ? 'animate-leg-step-right' : ''}`} />
                       </>
                     )}
                  </div>
                </div>

                {/* Shadow */}
                <div className={`w-7 h-2 bg-black/30 rounded-full blur-[2px] mt-1 z-10 ${isMoving ? 'animate-shadow-squish' : ''}`} />
              </div>
            </div>

            {/* HUD overlay */}
            <div className="absolute bottom-4 left-4 glass-panel rounded-lg px-3 py-1.5 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-medium text-on-surface-muted uppercase tracking-wider">
                ⌨ WASD to move · E to interact
              </span>
            </div>

            {/* Avatar state indicator */}
            {avatarState !== 'idle' && avatarState !== 'walking' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel rounded-lg px-3 py-1.5 pointer-events-none">
                <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                  {avatarState === 'sitting' && '🪑 Sitting — press WASD to stand'}
                  {avatarState === 'swimming' && '🏊 Swimming'}
                  {avatarState === 'dancing' && '💃 Dancing'}
                  {avatarState === 'waving' && '👋 Waving'}
                </span>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                micOn ? "bg-surface-high text-on-surface hover:bg-surface-highest" : "bg-red-500/20 text-red-400"
              }`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                videoOn ? "bg-surface-high text-on-surface hover:bg-surface-highest" : "bg-red-500/20 text-red-400"
              }`}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button className="p-3 rounded-xl bg-surface-high text-on-surface hover:bg-surface-highest transition-all cursor-pointer">
              <Monitor className="w-5 h-5" />
            </button>
            <Link href="/spaces">
              <button className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer">
                <Phone className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        <ChatPanel 
          chatOpen={chatOpen} 
          messagesLoading={messagesLoading} 
          messages={messages} 
        />
      </div>
    </div>
  );
}
