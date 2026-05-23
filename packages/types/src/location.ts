// ─── Location / Avatar position ───────────────────────────────────────────────

export type AvatarState = 'idle' | 'walking' | 'sitting' | 'swimming' | 'dancing' | 'waving';
export type FacingDirection = 'up' | 'down' | 'left' | 'right';

/** Live avatar position emitted by a client */
export interface AvatarPosition {
  userId: string;
  x: number;
  y: number;
  facing: FacingDirection;
  state: AvatarState;
}

/** Geo-location event (for map / location features) */
export interface GeoLocation {
  userId: string;
  spaceId: string;
  lat: number;
  lng: number;
  accuracy?: number;
  recordedAt: string; // ISO 8601
}
