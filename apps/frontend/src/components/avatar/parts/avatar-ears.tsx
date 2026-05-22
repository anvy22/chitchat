import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarEars({ config, facing, s }: AvatarPartProps) {
  const earColor = config.skinTone;
  const innerEarColor = darkenHex(config.skinTone, 20);
  const borderColor = darkenHex(earColor, 15);

  const earStyle: React.CSSProperties = {
    position: "absolute",
    top: s(9),
    width: s(3),
    height: s(4.5),
    backgroundColor: earColor,
    borderRadius: s(2),
    border: `${Math.max(1, s(1))}px solid ${borderColor}`,
    zIndex: 25,
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    top: s(1),
    left: s(0.5),
    width: s(1.5),
    height: s(2.5),
    backgroundColor: innerEarColor,
    borderRadius: s(1),
    opacity: 0.8,
  };

  if (facing === "up") {
    // Ears visible from back
    return (
      <>
        <div style={{ ...earStyle, left: -s(1.5), zIndex: 10 }}>
          <div style={{ ...innerStyle, left: s(0.5) }} />
        </div>
        <div style={{ ...earStyle, right: -s(1.5), zIndex: 10 }}>
          <div style={{ ...innerStyle, left: s(0.5) }} />
        </div>
      </>
    );
  }

  if (facing === "left") {
    // Only right ear visible (on the back side)
    return (
      <div style={{ ...earStyle, right: -s(1.5), zIndex: 10 }}>
        <div style={{ ...innerStyle, left: s(0.5) }} />
      </div>
    );
  }
  if (facing === "right") {
    // Only left ear visible (on the back side)
    return (
      <div style={{ ...earStyle, left: -s(1.5), zIndex: 10 }}>
        <div style={{ ...innerStyle, left: s(0.5) }} />
      </div>
    );
  }

  // Front view
  return (
    <>
      <div style={{ ...earStyle, left: -s(1.8) }}>
        <div style={{ ...innerStyle, left: s(0.5) }} />
      </div>
      <div style={{ ...earStyle, right: -s(1.8) }}>
        <div style={{ ...innerStyle, left: s(0.5) }} />
      </div>
    </>
  );
}
