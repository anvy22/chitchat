"use client";

import type { AvatarConfig, AvatarState } from "@/types";
import { DEFAULT_AVATAR_CONFIG } from "@/types";
import { darkenHex } from "./utils";
import { AvatarHair } from "./parts/avatar-hair";
import { AvatarFacialHair } from "./parts/avatar-facial-hair";
import { AvatarMouth } from "./parts/avatar-mouth";
import { AvatarEyes } from "./parts/avatar-eyes";
import { AvatarFaceDetails } from "./parts/avatar-face-details";
import { AvatarEars } from "./parts/avatar-ears";
import { AvatarOutfit } from "./parts/avatar-outfit";
import { AvatarAccessory } from "./parts/avatar-accessory";

// ─── Size Presets ──────────────────────────────────────────────────
const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 80,
  xl: 160,
} as const;

type AvatarSize = keyof typeof SIZE_MAP;

interface AvatarCharacterProps {
  config?: AvatarConfig;
  size?: AvatarSize;
  isMoving?: boolean;
  facing?: "down" | "up" | "left" | "right";
  state?: AvatarState;
  showShadow?: boolean;
  className?: string;
}

/**
 * Shared pixel-art avatar renderer.
 * Renders a Gather.town style character from an AvatarConfig.
 * Fully CSS – no canvas/SVG – works at any size from 24px to 160px.
 */
export function AvatarCharacter({
  config = DEFAULT_AVATAR_CONFIG,
  size = "md",
  isMoving = false,
  facing = "down",
  state = "idle",
  showShadow = true,
  className = "",
}: AvatarCharacterProps) {
  const px = SIZE_MAP[size];
  const scale = px / 32; // base unit is 32px (sm)

  const s = (v: number) => Math.round(v * scale);

  // Derived colors
  const skinDarker = darkenHex(config.skinTone, 20);

  const isSitting = state === "sitting";
  const isSwimming = state === "swimming";

  const headSize = s(18);
  const bodyHeight = isSitting ? s(14) : s(18);
  const totalHeight = isSitting ? headSize + bodyHeight - s(2) : headSize + bodyHeight + s(8);

  const partProps = { config, facing, s, isMoving };

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ width: s(32), height: totalHeight + (showShadow ? s(4) : 0) }}
    >
      {/* Character container */}
      <div
        className={`relative flex flex-col items-center ${isMoving && !isSitting ? "animate-gather-wobble" : ""} ${isSitting ? "avatar-sitting" : ""} ${isSwimming ? "avatar-swimming" : ""}`}
        style={{ width: s(32), height: totalHeight }}
      >
        {/* Head */}
        <div
          style={{
            position: "relative",
            width: headSize,
            height: headSize,
            backgroundColor: config.skinTone,
            borderRadius: config.faceShape === "round" 
              ? "50%" 
              : config.faceShape === "square" 
                ? `${s(2)}px` 
                : config.faceShape === "heart" 
                  ? `${s(6)}px ${s(6)}px ${s(12)}px ${s(12)}px`
                  : `${s(6)}px`, // oval
            border: `${Math.max(1, s(1))}px solid ${skinDarker}`,
            zIndex: 30,
            flexShrink: 0,
            boxShadow: `0 ${s(1)}px ${s(2)}px rgba(0,0,0,0.1)`,
            overflow: "visible",
          }}
        >
          {/* Face Shading/Depth */}
          {facing !== "up" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)`,
                pointerEvents: "none",
                zIndex: 31,
              }}
            />
          )}
          
          <AvatarEars {...partProps} />
          <AvatarHair {...partProps} />
          <AvatarFacialHair {...partProps} />
          <AvatarFaceDetails {...partProps} />
          <AvatarEyes {...partProps} />
          <AvatarMouth {...partProps} />
          <AvatarAccessory {...partProps} />
        </div>

        {/* Body container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            width: s(26),
            height: bodyHeight,
            marginTop: -s(3),
            zIndex: 20,
            flexShrink: 0,
          }}
        >
          {/* Left Arm */}
          <div
            className={isMoving && !isSitting ? "animate-arm-swing-left" : ""}
            style={{
              position: "absolute",
              left: 0,
              top: s(3),
              width: s(5),
              height: s(10),
              backgroundColor: config.skinTone,
              borderRadius: s(3),
              zIndex: 10,
              transformOrigin: "top center",
              boxShadow: `0 ${s(1)}px ${s(1)}px rgba(0,0,0,0.05)`,
            }}
          />

          {/* Right Arm */}
          <div
            className={isMoving && !isSitting ? "animate-arm-swing-right" : ""}
            style={{
              position: "absolute",
              right: 0,
              top: s(3),
              width: s(5),
              height: s(10),
              backgroundColor: config.skinTone,
              borderRadius: s(3),
              zIndex: 10,
              transformOrigin: "top center",
              boxShadow: `0 ${s(1)}px ${s(1)}px rgba(0,0,0,0.05)`,
            }}
          />

          {/* Torso / Outfit */}
          <AvatarOutfit {...partProps} />

          {/* Legs */}
          {!isSitting && (
            <>
              <div
                className={isMoving ? "animate-leg-step-left" : ""}
                style={{
                  position: "absolute",
                  left: s(6),
                  bottom: -s(5),
                  width: s(5),
                  height: s(7),
                  backgroundColor: "#1E293B",
                  borderRadius: s(3),
                  zIndex: 10,
                  transformOrigin: "top center",
                }}
              />
              <div
                className={isMoving ? "animate-leg-step-right" : ""}
                style={{
                  position: "absolute",
                  right: s(6),
                  bottom: -s(5),
                  width: s(5),
                  height: s(7),
                  backgroundColor: "#1E293B",
                  borderRadius: s(3),
                  zIndex: 10,
                  transformOrigin: "top center",
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Shadow */}
      {showShadow && (
        <div
          className={isMoving && !isSitting ? "animate-shadow-squish" : ""}
          style={{
            position: "relative",
            width: s(18),
            height: s(4),
            marginTop: s(1),
          }}
        >
          {/* Dark core */}
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", borderRadius: "50%", filter: `blur(${s(0.5)}px)` }} />
          {/* Soft glow */}
          <div style={{ position: "absolute", inset: `-${s(1)}px`, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "50%", filter: `blur(${s(2)}px)` }} />
        </div>
      )}
    </div>
  );
}
