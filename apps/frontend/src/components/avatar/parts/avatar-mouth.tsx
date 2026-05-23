import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarMouth({ config, facing, s, isMoving }: AvatarPartProps) {
  if (facing === "up") return null;

  const mouthColor = darkenHex(config.skinTone, 40);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    bottom: s(3),
    left: "50%",
    transform: facing === "down" ? "translateX(-50%)" : facing === "left" ? `translateX(${s(-10)}px)` : `translateX(${s(2)}px)`,
    backgroundColor: mouthColor,
    zIndex: 31,
    transition: "width 0.15s, height 0.15s, border-radius 0.15s",
  };

  // When moving, override the configured mouth to show an active expression
  if (isMoving) {
    return (
      <div
        style={{
          ...baseStyle,
          width: s(3),
          height: s(2),
          borderRadius: "50%",
        }}
      />
    );
  }

  switch (config.mouth) {
    case "smile":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(6),
            height: s(3),
            borderRadius: `0 0 ${s(3)}px ${s(3)}px`,
          }}
        />
      );
    case "surprised":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(4),
            height: s(4),
            borderRadius: "50%",
          }}
        />
      );
    case "cool":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(6),
            height: s(1),
            borderRadius: s(1),
          }}
        />
      );
    case "neutral":
    default:
      return (
        <div
          style={{
            ...baseStyle,
            width: s(4),
            height: s(1),
            borderRadius: s(0.5),
          }}
        />
      );
  }
}
