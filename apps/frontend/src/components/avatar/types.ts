import type { AvatarConfig } from "@/types";

export interface AvatarPartProps {
  config: AvatarConfig;
  facing: "down" | "up" | "left" | "right";
  s: (v: number) => number;
  isMoving?: boolean;
}
