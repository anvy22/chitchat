import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarFaceDetails({ config, facing, s }: AvatarPartProps) {
  if (facing === "up") return null;
  
  const noseColor = darkenHex(config.skinTone, 15);
  const blushColor = "#FF8B8B";

  return (
    <>
      {/* Nose */}
      <div
        style={{
          position: "absolute",
          top: s(11),
          left: facing === "left" ? s(-1) : facing === "right" ? "auto" : "50%",
          right: facing === "right" ? s(-1) : "auto",
          transform: facing === "down" ? "translateX(-50%)" : "none",
          width: s(2.5),
          height: s(2),
          backgroundColor: noseColor,
          borderRadius: s(1),
          opacity: 0.7,
          zIndex: 34,
          boxShadow: facing !== "down" ? `inset ${facing === "left" ? -s(0.5) : s(0.5)}px 0 rgba(0,0,0,0.2)` : "none",
        }}
      />
      
      {/* Blush (only for front) */}
      {facing === "down" && (
        <>
          <div
            style={{
              position: "absolute",
              top: s(12),
              left: s(3),
              width: s(3),
              height: s(1.5),
              backgroundColor: blushColor,
              borderRadius: "50%",
              opacity: 0.2,
              zIndex: 33,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: s(12),
              right: s(3),
              width: s(3),
              height: s(1.5),
              backgroundColor: blushColor,
              borderRadius: "50%",
              opacity: 0.2,
              zIndex: 33,
            }}
          />
        </>
      )}
    </>
  );
}
