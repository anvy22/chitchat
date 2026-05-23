import React from "react";
import type { AvatarPartProps } from "../types";

export function AvatarHair({ config, facing, s }: AvatarPartProps) {
  const hairBase: React.CSSProperties = {
    backgroundColor: config.hairColor,
    position: "absolute",
    borderRadius: s(2),
  };

  const isBack = facing === "up";
  const isLeft = facing === "left";
  const isRight = facing === "right";

  const shadowColor = "rgba(0,0,0,0.15)";
  const highlightColor = "rgba(255,255,255,0.1)";

  switch (config.hairStyle) {
    case "bald":
      return null;

    case "crew-cut":
      return (
        <div
          style={{
            ...hairBase,
            top: 0,
            left: 0,
            right: 0,
            height: isBack ? "100%" : `${s(6)}px`,
            borderRadius: isBack ? "inherit" : `${s(6)}px ${s(6)}px ${s(1)}px ${s(1)}px`,
            boxShadow: `inset 0 -${s(1)}px ${shadowColor}`,
          }}
        />
      );

    case "medium":
      return (
        <>
          <div
            style={{
              ...hairBase,
              top: 0,
              left: 0,
              right: 0,
              height: isBack ? "100%" : `${s(8)}px`,
              borderRadius: isBack ? "inherit" : `${s(6)}px ${s(6)}px ${s(1)}px ${s(1)}px`,
              boxShadow: `inset 0 -${s(2)}px ${shadowColor}`,
            }}
          />
          {/* Side tufts */}
          {(facing === "down" || isLeft || isBack) && (
            <div
              style={{
                ...hairBase,
                top: s(3),
                left: -s(1),
                width: `${s(4)}px`,
                height: `${s(8)}px`,
                borderRadius: `${s(2)}px`,
                boxShadow: `inset -${s(1)}px 0 ${shadowColor}`,
              }}
            />
          )}
          {(facing === "down" || isRight || isBack) && (
            <div
              style={{
                ...hairBase,
                top: s(3),
                right: -s(1),
                width: `${s(4)}px`,
                height: `${s(8)}px`,
                borderRadius: `${s(2)}px`,
                boxShadow: `inset ${s(1)}px 0 ${shadowColor}`,
              }}
            />
          )}
        </>
      );

    case "long":
      return (
        <>
          <div
            style={{
              ...hairBase,
              top: 0,
              left: 0,
              right: 0,
              height: isBack ? "100%" : `${s(8)}px`,
              borderRadius: isBack ? "inherit" : `${s(6)}px ${s(6)}px 0 0`,
              boxShadow: `inset 0 -${s(2)}px ${shadowColor}`,
            }}
          />
          {/* Long sides/back */}
          <div
            style={{
              ...hairBase,
              top: s(2),
              left: isRight ? "auto" : -s(2),
              right: isLeft ? "auto" : -s(2),
              width: isBack || facing === "down" ? "calc(100% + " + s(4) + "px)" : `${s(18)}px`,
              height: `${s(16)}px`,
              borderRadius: `${s(2)}px`,
              zIndex: isBack ? 10 : -1,
              boxShadow: `inset 0 -${s(4)}px ${shadowColor}`,
            }}
          />
        </>
      );

    case "curly":
      return (
        <>
          <div
            style={{
              ...hairBase,
              top: -s(2),
              left: -s(1),
              right: -s(1),
              height: isBack ? "calc(100% + " + s(2) + "px)" : `${s(12)}px`,
              borderRadius: isBack ? "inherit" : `${s(8)}px`,
              boxShadow: `inset 0 -${s(2)}px ${shadowColor}`,
            }}
          />
          {/* Curly bumps */}
          <div style={{ ...hairBase, top: -s(3), left: s(2), width: s(6), height: s(6), borderRadius: "50%", boxShadow: `inset ${s(1)}px ${s(1)}px ${highlightColor}` }} />
          <div style={{ ...hairBase, top: -s(3), right: s(2), width: s(6), height: s(6), borderRadius: "50%", boxShadow: `inset -${s(1)}px ${s(1)}px ${highlightColor}` }} />
        </>
      );

    case "ponytail":
      return (
        <>
          <div
            style={{
              ...hairBase,
              top: 0,
              left: 0,
              right: 0,
              height: isBack ? "100%" : `${s(7)}px`,
              borderRadius: isBack ? "inherit" : `${s(6)}px ${s(6)}px ${s(1)}px ${s(1)}px`,
              boxShadow: `inset 0 -${s(1)}px ${shadowColor}`,
            }}
          />
          {/* Ponytail tail */}
          <div
            style={{
              ...hairBase,
              top: isBack ? s(4) : s(2),
              // Correct side positioning: Back of the head
              left: isRight ? -s(5) : isBack ? "50%" : "auto",
              right: isLeft ? -s(5) : "auto",
              transform: isBack ? "translateX(-50%)" : "none",
              width: `${s(6)}px`,
              height: `${s(12)}px`,
              borderRadius: `${s(3)}px`,
              zIndex: isBack ? 20 : -1,
              boxShadow: `inset 0 -${s(3)}px ${shadowColor}`,
            }}
          />
        </>
      );

    case "bun":
      return (
        <>
          <div
            style={{
              ...hairBase,
              top: 0,
              left: 0,
              right: 0,
              height: isBack ? "100%" : `${s(7)}px`,
              borderRadius: isBack ? "inherit" : `${s(6)}px ${s(6)}px ${s(1)}px ${s(1)}px`,
              boxShadow: `inset 0 -${s(1)}px ${shadowColor}`,
            }}
          />
          {/* Bun */}
          <div
            style={{
              ...hairBase,
              top: -s(6),
              left: "50%",
              transform: "translateX(-50%)",
              width: `${s(10)}px`,
              height: `${s(10)}px`,
              borderRadius: "50%",
              boxShadow: `inset 0 -${s(2)}px ${shadowColor}, inset 0 ${s(1)}px ${highlightColor}`,
            }}
          />
        </>
      );

    default:
      return null;
  }
}
