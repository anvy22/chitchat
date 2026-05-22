import React from "react";
import type { AvatarPartProps } from "../types";
import { darkenHex } from "../utils";

export function AvatarOutfit({ config, facing, s }: AvatarPartProps) {
  const color = config.outfitColor;
  const pattern = config.outfitPattern;

  const getPatternStyle = (): React.CSSProperties => {
    switch (pattern) {
      case "stripes":
        return {
          backgroundImage: `linear-gradient(45deg, ${darkenHex(color, 10)} 25%, transparent 25%, transparent 50%, ${darkenHex(color, 10)} 50%, ${darkenHex(color, 10)} 75%, transparent 75%, transparent)`,
          backgroundSize: `${s(8)}px ${s(8)}px`,
        };
      case "dots":
        return {
          backgroundImage: `radial-gradient(${darkenHex(color, 15)} 20%, transparent 20%)`,
          backgroundSize: `${s(6)}px ${s(6)}px`,
        };
      case "checkered":
        return {
          backgroundImage: `conic-gradient(${darkenHex(color, 10)} 90deg, ${color} 90deg 180deg, ${darkenHex(color, 10)} 180deg 270deg, ${color} 270deg)`,
          backgroundSize: `${s(8)}px ${s(8)}px`,
        };
      case "camo":
        return {
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${darkenHex(color, 20)} 20%, transparent 0),
            radial-gradient(circle at 70% 60%, ${darkenHex(color, 15)} 25%, transparent 0),
            radial-gradient(circle at 40% 80%, ${darkenHex(color, 25)} 15%, transparent 0)
          `,
          backgroundSize: "100% 100%",
        };
      default:
        return {};
    }
  };

  const baseStyle: React.CSSProperties = {
    backgroundColor: color,
    position: "relative",
    zIndex: 20,
    ...getPatternStyle(),
  };

  switch (config.outfit) {
    case "hoodie":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(20),
            height: s(18),
            borderRadius: `${s(3)}px`,
          }}
        >
          {/* Hood collar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: s(12),
              height: s(4),
              backgroundColor: darkenHex(color, 25),
              borderRadius: `0 0 ${s(4)}px ${s(4)}px`,
              zIndex: 21,
            }}
          />
        </div>
      );

    case "suit":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(20),
            height: s(18),
            borderRadius: `${s(3)}px`,
          }}
        >
          {/* Shirt white */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: s(8),
              height: s(8),
              backgroundColor: "#FFF",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              zIndex: 21,
            }}
          />
          {/* Tie line */}
          <div
            style={{
              position: "absolute",
              top: s(1),
              left: "50%",
              transform: "translateX(-50%)",
              width: s(2),
              height: s(10),
              backgroundColor: "#C41E3A",
              borderRadius: s(1),
              zIndex: 22,
            }}
          />
        </div>
      );

    case "dress":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(22),
            height: s(22),
            borderRadius: `${s(3)}px ${s(3)}px ${s(6)}px ${s(6)}px`,
            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        />
      );

    case "tank-top":
      return (
        <div
          style={{
            ...baseStyle,
            width: s(18),
            height: s(18),
            borderRadius: `${s(3)}px`,
          }}
        >
          {/* Shoulder cutouts */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: s(4),
              height: s(5),
              backgroundColor: config.skinTone,
              borderRadius: `0 0 ${s(3)}px 0`,
              zIndex: 21,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: s(4),
              height: s(5),
              backgroundColor: config.skinTone,
              borderRadius: `0 0 0 ${s(3)}px`,
              zIndex: 21,
            }}
          />
        </div>
      );

    case "tshirt":
    default:
      return (
        <div
          style={{
            ...baseStyle,
            width: s(20),
            height: s(18),
            borderRadius: `${s(3)}px`,
            boxShadow: `inset 0 ${s(1)}px 0 ${darkenHex(color, 25)}`,
          }}
        />
      );
  }
}
