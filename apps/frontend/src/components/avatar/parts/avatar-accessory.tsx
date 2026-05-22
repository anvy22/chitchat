import React from "react";
import type { AvatarPartProps } from "../types";

export function AvatarAccessory({ config, facing, s }: AvatarPartProps) {
  switch (config.accessory) {
    case "glasses":
      if (facing === "up") return null;
      if (facing === "left" || facing === "right") {
        const isL = facing === "left";
        return (
          <div style={{ position: "absolute", top: s(8.5), left: isL ? s(2) : "auto", right: isL ? "auto" : s(2), display: "flex", alignItems: "center", zIndex: 40 }}>
            <div style={{ width: s(8), height: s(5), border: `${Math.max(1, s(1.5))}px solid #333`, borderRadius: s(1.5), backgroundColor: "rgba(150, 200, 255, 0.4)", position: "relative" }}>
               <div style={{ position: "absolute", top: s(0.5), left: isL ? s(0.5) : "auto", right: isL ? "auto" : s(0.5), width: s(2), height: s(2), backgroundColor: "white", borderRadius: "50%", opacity: 0.5 }} />
            </div>
            {/* Temple frame */}
            <div style={{ width: s(8), height: Math.max(1, s(1)), backgroundColor: "#333", marginLeft: isL ? -s(1) : 0, marginRight: isL ? 0 : -s(1) }} />
          </div>
        );
      }
      return (
        <div style={{ position: "absolute", top: s(8.5), left: "50%", transform: "translateX(-50%)", display: "flex", gap: s(1.5), zIndex: 40 }}>
          <div style={{ width: s(6.5), height: s(5), border: `${Math.max(1, s(1.5))}px solid #333`, borderRadius: s(1.5), backgroundColor: "rgba(150, 200, 255, 0.3)", position: "relative" }}>
             <div style={{ position: "absolute", top: s(0.5), left: s(0.5), width: s(1.5), height: s(1.5), backgroundColor: "white", borderRadius: "50%", opacity: 0.3 }} />
          </div>
          <div style={{ width: s(6.5), height: s(5), border: `${Math.max(1, s(1.5))}px solid #333`, borderRadius: s(1.5), backgroundColor: "rgba(150, 200, 255, 0.3)", position: "relative" }}>
             <div style={{ position: "absolute", top: s(0.5), left: s(0.5), width: s(1.5), height: s(1.5), backgroundColor: "white", borderRadius: "50%", opacity: 0.3 }} />
          </div>
        </div>
      );

    case "headphones":
      if (facing === "up" || facing === "down") {
        return (
          <div
            style={{
              position: "absolute",
              top: -s(1),
              left: "50%",
              transform: "translateX(-50%)",
              width: s(20),
              height: s(10),
              border: `${Math.max(1, s(2))}px solid #333`,
              borderBottom: "none",
              borderRadius: `${s(10)}px ${s(10)}px 0 0`,
              zIndex: 40,
            }}
          >
            {/* Ear cups */}
            <div style={{ position: "absolute", bottom: -s(2), left: -s(3), width: s(6), height: s(8), backgroundColor: "#444", borderRadius: s(2), border: `${Math.max(1, s(1))}px solid #222`, boxShadow: `inset ${s(1)}px ${s(1)}px rgba(255,255,255,0.1)` }} />
            <div style={{ position: "absolute", bottom: -s(2), right: -s(3), width: s(6), height: s(8), backgroundColor: "#444", borderRadius: s(2), border: `${Math.max(1, s(1))}px solid #222`, boxShadow: `inset -${s(1)}px ${s(1)}px rgba(255,255,255,0.1)` }} />
          </div>
        );
      }
      return (
        <div
          style={{
            position: "absolute",
            top: s(7),
            left: facing === "left" ? "auto" : -s(2),
            right: facing === "right" ? "auto" : -s(2),
            width: s(7),
            height: s(10),
            backgroundColor: "#444",
            borderRadius: s(3),
            zIndex: 40,
            border: `${Math.max(1, s(1.5))}px solid #333`,
            boxShadow: `inset ${facing === "left" ? -s(1) : s(1)}px ${s(1)}px rgba(255,255,255,0.1)`,
          }}
        />
      );

    case "hat":
      const isProfile = facing === "left" || facing === "right";
      return (
        <div style={{ 
          position: "absolute", 
          top: -s(5), 
          left: "50%", 
          transform: isProfile ? (facing === "left" ? "translateX(-60%)" : "translateX(-40%)") : "translateX(-50%)", 
          zIndex: 40 
        }}>
          {/* Brim */}
          <div
            style={{
              width: facing === "down" ? s(22) : isProfile ? s(20) : s(18),
              height: s(3),
              backgroundColor: "#5A3E28",
              borderRadius: s(2),
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: `0 ${s(1)}px ${s(1)}px rgba(0,0,0,0.2)`,
            }}
          />
          {/* Crown */}
          <div
            style={{
              width: s(14),
              height: s(8),
              backgroundColor: "#6B4C35",
              borderRadius: `${s(3)}px ${s(3)}px 0 0`,
              position: "absolute",
              bottom: s(2),
              left: isProfile ? (facing === "left" ? "40%" : "60%") : "50%",
              transform: "translateX(-50%)",
              boxShadow: `inset 0 ${s(1)}px ${s(1)}px rgba(255,255,255,0.1)`,
            }}
          />
        </div>
      );

    case "earrings":
      if (facing === "left" || facing === "right") {
        return (
          <div
            style={{
              position: "absolute",
              top: s(12),
              left: facing === "left" ? s(2) : "auto",
              right: facing === "right" ? s(2) : "auto",
              width: s(2),
              height: s(2),
              backgroundColor: "#FFD700",
              borderRadius: "50%",
              zIndex: 40,
              boxShadow: "0 0 4px rgba(255, 215, 0, 0.6)",
            }}
          />
        );
      }
      return (
        <>
          <div style={{ position: "absolute", top: s(12), left: -s(2), width: s(3), height: s(3), backgroundColor: "#FFD700", borderRadius: "50%", zIndex: 40, boxShadow: "0 0 4px rgba(255, 215, 0, 0.6)" }} />
          <div style={{ position: "absolute", top: s(12), right: -s(2), width: s(3), height: s(3), backgroundColor: "#FFD700", borderRadius: "50%", zIndex: 40, boxShadow: "0 0 4px rgba(255, 215, 0, 0.6)" }} />
        </>
      );

    case "mask":
      if (facing === "up") return null;
      return (
        <div
          style={{
            position: "absolute",
            top: s(11),
            left: "50%",
            transform: "translateX(-50%)",
            width: s(14),
            height: s(6),
            backgroundColor: "#E0E0E0",
            borderRadius: s(2),
            zIndex: 40,
            border: `${Math.max(1, s(0.5))}px solid #CCC`,
          }}
        />
      );

    default:
      return null;
  }
}
