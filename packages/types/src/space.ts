import type { UserSummary } from './user';

// ─── Asset / Canvas primitives ────────────────────────────────────────────────

export type ActionType = 'SIT' | 'TELEPORT' | 'TOGGLE' | 'OPEN_LINK' | 'EMOTE' | 'SWIM';

export interface ElementAction {
  type: ActionType;
  label: string;
  icon?: string;
  payload?: Record<string, unknown>;
}

export type CollisionType = 'solid' | 'partial' | 'none';
export type AssetCategory = 'furniture' | 'decoration' | 'zone' | 'interactive';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  icon: string;
  color: string;
  width: number;
  height: number;
  collision?: CollisionType;
  defaultActions?: ElementAction[];
}

export interface PlacedElement {
  id: string;
  assetId: string;
  x: number;
  y: number;
  rotation?: number;
  customColor?: string;
  customTexture?: string;
  actions?: ElementAction[]; // overrides asset defaultActions when set
}

export type BackgroundTheme =
  | 'dark-tiles'
  | 'wood-floor'
  | 'blue-carpet'
  | 'concrete'
  | 'grass'
  | 'marble'
  | 'sand';

// ─── Space ────────────────────────────────────────────────────────────────────

export type SpaceType = 'office' | 'meeting' | 'lounge' | 'event';
export type RoomFeature = 'voice' | 'video' | 'chat' | 'swimming' | 'admin-only' | 'presentation';

/** Full space record as returned by REST API */
export interface Space {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  bgTheme: BackgroundTheme;
  bgColor: string;
  elements: PlacedElement[];
  type: SpaceType;
  maxCapacity: number;
  isLive: boolean;
  createdBy: string;   // user UUID
  createdAt: string;
  updatedAt: string;
}

/** Space enriched with live presence data (used on dashboard / lobby) */
export interface SpaceWithPresence extends Space {
  activeUsers: UserSummary[];
  memberCount: number;
  lastActive: string;
  features?: RoomFeature[];
}

// ─── DTO ─────────────────────────────────────────────────────────────────────

export interface CreateSpaceDto {
  name: string;
  description?: string;
  type: SpaceType;
  bgTheme?: BackgroundTheme;
  bgColor?: string;
  maxCapacity?: number;
  workspaceId: string;
}

export interface UpdateSpaceDto {
  name?: string;
  description?: string;
  bgTheme?: BackgroundTheme;
  bgColor?: string;
  elements?: PlacedElement[];
  maxCapacity?: number;
  isLive?: boolean;
}

// ─── Canvas snapshot (saved locally / synced to DB) ──────────────────────────

export interface CanvasData {
  id: string;
  name?: string;
  description?: string;
  bgTheme: BackgroundTheme;
  bgColor: string;
  elements: PlacedElement[];
  updatedAt: number; // unix ms
}

// ─── Templates ───────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  title: string;
  description?: string;
  iconName?: string;
  color: string;
  bgTheme?: BackgroundTheme;
  elements: PlacedElement[];
}
