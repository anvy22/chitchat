import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarEyes({ config, facing, s, isMoving }: AvatarPartProps) {
  if (facing === "up") return null;
  const eyeColor = config.eyeColor;
  const eyeShape = config.eyeShape;

  const getEyeStyle = (isLeft: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: Math.max(2, s(3)),
      height: Math.max(2, s(3)),
      backgroundColor: eyeColor,
      borderRadius: "50%",
      transition: "height 0.15s, border-radius 0.15s",
    };

    // Squint slightly during movement for a determined look
    if (isMoving) {
      return { ...base, height: s(2), borderRadius: s(1) };
    }

    if (eyeShape === "squint") {
      return { ...base, height: s(1.5), borderRadius: s(1) };
    }
    if (eyeShape === "wide") {
      return { ...base, width: s(4), height: s(4), border: `1px solid ${darkenHex(eyeColor, 20)}` };
    }
    if (eyeShape === "cool") {
      return { ...base, width: s(5), height: s(2), borderRadius: `0 0 ${s(2)}px ${s(2)}px` };
    }
    return base;
  };

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: s(9),
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: s(2),
    zIndex: 35,
  };

  if (facing === "left") {
    return (
      <div style={{ ...containerStyle, left: s(3), transform: "none" }}>
        {/* Main profile eye - clean and readable */}
        <div style={{ ...getEyeStyle(true), width: s(4.5), height: isMoving ? s(3) : s(4), borderRadius: s(1), position: "relative" }}>
          <div style={{ position: "absolute", top: s(0.5), left: s(0.5), width: s(1.5), height: s(1.5), backgroundColor: "white", borderRadius: s(0.5), opacity: 0.8 }} />
        </div>
      </div>
    );
  }
  if (facing === "right") {
    return (
      <div style={{ ...containerStyle, left: "auto", right: s(3), transform: "none" }}>
        {/* Main profile eye - clean and readable */}
        <div style={{ ...getEyeStyle(false), width: s(4.5), height: isMoving ? s(3) : s(4), borderRadius: s(1), position: "relative" }}>
          <div style={{ position: "absolute", top: s(0.5), right: s(0.5), width: s(1.5), height: s(1.5), backgroundColor: "white", borderRadius: s(0.5), opacity: 0.8 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ ...getEyeStyle(true), position: "relative" }}>
        {/* Glint */}
        <div style={{ position: "absolute", top: s(0.5), left: s(0.5), width: s(1), height: s(1), backgroundColor: "white", borderRadius: "50%", opacity: 0.8 }} />
      </div>
      <div style={{ ...getEyeStyle(false), position: "relative" }}>
        {/* Glint */}
        <div style={{ position: "absolute", top: s(0.5), right: s(0.5), width: s(1), height: s(1), backgroundColor: "white", borderRadius: "50%", opacity: 0.8 }} />
      </div>
    </div>
  );
}
