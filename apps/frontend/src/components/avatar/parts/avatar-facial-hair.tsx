import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarFacialHair({ config, facing, s }: AvatarPartProps) {
  if (config.facialHair === "none" || facing === "up") return null;

  const color = config.hairColor;
  const style: React.CSSProperties = {
    position: "absolute",
    backgroundColor: color,
    zIndex: 32,
  };

  switch (config.facialHair) {
    case "mustache":
      return (
        <div
          style={{
            ...style,
            bottom: s(3),
            left: "50%",
            transform: "translateX(-50%)",
            width: s(10),
            height: s(2),
            borderRadius: s(1),
          }}
        />
      );
    case "beard":
      return (
        <div
          style={{
            ...style,
            bottom: -s(1),
            left: "50%",
            transform: "translateX(-50%)",
            width: s(14),
            height: s(6),
            borderRadius: `0 0 ${s(6)}px ${s(6)}px`,
            border: `${Math.max(1, s(1))}px solid ${darkenHex(color, 20)}`,
          }}
        />
      );
    case "stubble":
      return (
        <div
          style={{
            ...style,
            bottom: -s(1),
            left: "50%",
            transform: "translateX(-50%)",
            width: s(14),
            height: s(5),
            borderRadius: `0 0 ${s(6)}px ${s(6)}px`,
            opacity: 0.4,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient(${color} 1px, transparent 0)`,
            backgroundSize: `${s(2)}px ${s(2)}px`,
          }}
        />
      );
    default:
      return null;
  }
}
