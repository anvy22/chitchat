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
import { Skeleton } from "@/components/ui/skeleton";
import { useSpace, useMessages, useAssets, useCanvasData, useAuthUser, useAvatarConfig } from "@/hooks/use-queries";
import { AvatarCharacter } from "@/components/avatar/avatar-character";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { TopDownAssetRenderer } from "@/components/editor/top-down-asset-renderer";
import { ChatPanel } from "@/components/spaces/chat-panel";
import { RoomHeader } from "@/components/spaces/room-header";
import type { BackgroundTheme, AvatarState, ElementAction, PlacedElement, Asset } from "@/types";

const GRID_SIZE = 40;
const AVATAR_SIZE = 32;
const MOVE_SPEED = 4.5;
const PROXIMITY_RANGE = 60; // pixels — how close the avatar must be to interact

// Collision hitbox size (centered on avatar's lower body / feet area)
const HITBOX_W = 10;
const HITBOX_H = 8;

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
  const { data: user } = useAuthUser();
  const { data: avatarConfig } = useAvatarConfig();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  // Avatar position — use refs for the game loop, sync to state at a throttled rate
  const [avatarPos, setAvatarPos] = useState({ x: 800, y: 800 });
  const [facing, setFacing] = useState<'down'|'up'|'left'|'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef({ x: 800, y: 800 });
  const facingRef = useRef<'down'|'up'|'left'|'right'>('down');
  const movingRef = useRef(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const lastSyncRef = useRef(0);

  // ─── Interaction System State ───────────────────────────────────────
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const avatarStateRef = useRef<AvatarState>(avatarState);
  avatarStateRef.current = avatarState;
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
        posRef.current = { x: seatX, y: seatY };
        setAvatarPos({ x: seatX, y: seatY });
        setAvatarState('sitting');
        setSittingOnId(el.id);
        sittingOnIdRef.current = el.id;
        lastSittingOnIdRef.current = el.id;
        movingRef.current = false;
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

  // Game loop — uses refs for position to avoid setState on every frame
  useEffect(() => {
    const placedElements = canvasData?.elements || [];

    // Build an AABB at the avatar's feet area for collision.
    // The avatar container stacks: name-tag (~18px) + character (~44px) + shadow (~10px).
    // We place the hitbox at the bottom of the character (feet), not the torso center.
    const getBodyRect = (posX: number, posY: number) => {
      const NAME_TAG_H = 18;
      const CHAR_H = 44;
      const centerX = posX + AVATAR_SIZE / 2;
      const feetY = posY + NAME_TAG_H + CHAR_H; // bottom of character
      return {
        left: centerX - HITBOX_W / 2,
        right: centerX + HITBOX_W / 2,
        top: feetY - HITBOX_H,
        bottom: feetY,
      };
    };

    /** Resolve the effective collision mode for an asset. */
    const getCollisionMode = (asset: Asset): "solid" | "partial" | "none" => {
      if (asset.collision) return asset.collision;
      // Default inference from category
      if (asset.category === "zone") return "none";
      if (asset.category === "decoration") {
        // Large decorations (2x2+) default to partial (tree-like trunk collision)
        if (asset.width >= 2 && asset.height >= 2) return "partial";
        // Small 1x1 decorations (plants, pots) are walkable
        return "none";
      }
      // furniture & interactive default to solid
      return "solid";
    };

    const isInside = (posX: number, posY: number, el: PlacedElement) => {
      const asset = assets?.find((a) => a.id === el.assetId);
      if (!asset) return false;
      if (el.id === sittingOnIdRef.current) return false;

      const mode = getCollisionMode(asset);
      if (mode === "none") return false;

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

      // For "partial" collision (trees), only block at the trunk — bottom 40% of tile,
      // centered horizontally at 50% width. This lets the avatar walk under the canopy.
      if (mode === "partial") {
        const trunkW = elW * 0.5;
        const trunkH = elH * 0.4;
        elLeft = elLeft + (elW - trunkW) / 2;
        elTop = elTop + elH - trunkH;
        elW = trunkW;
        elH = trunkH;
      }

      const shrink = mode === "partial" ? 2 : 6;
      const rect = getBodyRect(posX, posY);

      return (
        rect.left < (elLeft + elW - shrink) &&
        rect.right > (elLeft + shrink) &&
        rect.top < (elTop + elH - shrink) &&
        rect.bottom > (elTop + shrink)
      );
    };

    const loop = (now: number) => {
      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;

      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;

      const moving = dx !== 0 || dy !== 0;
      movingRef.current = moving;

      if (moving) {
        // Normalise diagonal movement so it's not ~40% faster
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * MOVE_SPEED;
        dy = (dy / len) * MOVE_SPEED;

        // Determine facing direction
        if (Math.abs(dx) >= Math.abs(dy)) {
          facingRef.current = dx < 0 ? 'left' : 'right';
        } else {
          facingRef.current = dy < 0 ? 'up' : 'down';
        }

        const prev = posRef.current;
        const minBound = -1000;
        const maxBoundX = worldW + 1000;
        const maxBoundY = worldH + 1000;

        let newX = Math.max(minBound, Math.min(maxBoundX - AVATAR_SIZE, prev.x + dx));
        let newY = Math.max(minBound, Math.min(maxBoundY - AVATAR_SIZE, prev.y + dy));

        // Find elements we're already overlapping (allow walking out)
        const alreadyOverlapping = new Set<string>();
        for (const el of placedElements) {
          if (isInside(prev.x, prev.y, el)) {
            alreadyOverlapping.add(el.id);
          }
        }

        const checkCol = (testX: number, testY: number) => {
          for (const el of placedElements) {
            if (alreadyOverlapping.has(el.id)) continue;
            if (isInside(testX, testY, el)) return true;
          }
          return false;
        };

        // Slide along walls: test each axis independently
        if (dx !== 0 && checkCol(newX, prev.y)) newX = prev.x;
        if (dy !== 0 && checkCol(newX, newY)) newY = prev.y;

        posRef.current = { x: newX, y: newY };
      }

      // Throttle React state sync to ~30fps to avoid excessive re-renders
      if (now - lastSyncRef.current > 33) {
        lastSyncRef.current = now;
        setAvatarPos(posRef.current);
        setFacing(facingRef.current);
        setIsMoving(movingRef.current);
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

    // Use the ref to avoid avatarState in the dependency array (prevents infinite loop)
    const currentState = avatarStateRef.current;

    // Auto-exit swimming when walking away from pool
    if (currentState === 'swimming' && (!closest || closest.actions[0]?.type !== 'SWIM')) {
      setAvatarState('idle');
    }
    // Auto-enter swimming when near pool
    if (currentState === 'idle' && closest && closest.actions[0]?.type === 'SWIM') {
      setAvatarState('swimming');
    }
  }, [avatarPos, assets, canvasData]);

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
      // Allow the camera to follow into the expanded negative coordinate space
      const minCamX = -1500;
      const minCamY = -1500;
      const maxCamX = worldW + 1500 - vw;
      const maxCamY = worldH + 1500 - vh;

      setCamera({
        x: Math.round(Math.max(minCamX, Math.min(maxCamX, targetX))),
        y: Math.round(Math.max(minCamY, Math.min(maxCamY, targetY))),
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
                  willChange: "left, top",
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
                  {user?.name.split(" ")[0] || "You"} (You)
                </div>

                {/* Character container - Gather.town style */}
                <AvatarCharacter
                  config={avatarConfig}
                  size="sm"
                  isMoving={isMoving}
                  facing={facing}
                  state={avatarState}
                  showShadow={false}
                />

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
