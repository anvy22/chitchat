export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "away" | "busy" | "offline";
  role: "admin" | "member" | "guest";
}

export interface Space {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  memberCount: number;
  activeUsers: User[];
  maxCapacity: number;
  type: "office" | "meeting" | "lounge" | "event";
  lastActive: string;
  isLive: boolean;
  features?: RoomFeature[];
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: "text" | "system" | "reaction";
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: "join" | "create" | "edit" | "message";
}

export interface DashboardStats {
  activeSpaces: number;
  onlineMembers: number;
  totalSpaces: number;
  messagestoday: number;
}

// ─── Interaction System ───────────────────────────────────────────────

/** All possible action types an element can expose. Add new ones here. */
export type ActionType = 'SIT' | 'TELEPORT' | 'TOGGLE' | 'OPEN_LINK' | 'EMOTE' | 'SWIM';

/** A single action attached to an element. */
export interface ElementAction {
  type: ActionType;
  label: string;              // e.g. "Sit Down", "Enter Room"
  icon?: string;              // emoji or icon name for the prompt
  payload?: Record<string, unknown>; // action-specific data
}

/** Possible visual states for the avatar. Add new ones here. */
export type AvatarState = 'idle' | 'walking' | 'sitting' | 'swimming' | 'dancing' | 'waving';

/** Room-level feature flags. */
export type RoomFeature = 'voice' | 'video' | 'chat' | 'swimming' | 'admin-only' | 'presentation';

// ─── Assets & Elements ───────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  category: "furniture" | "decoration" | "zone" | "interactive";
  icon: string;
  color: string;
  width: number;
  height: number;
  /** Default actions for all instances of this asset (can be overridden per element). */
  defaultActions?: ElementAction[];
  /**
   * Collision behavior. Defaults are inferred from category if omitted:
   * - "solid"  → full AABB collision (furniture, interactive)
   * - "partial"→ collision uses only the bottom portion of the tile (trees)
   * - "none"   → walk-through (zones, small decorations, walkable floors)
   */
  collision?: "solid" | "partial" | "none";
}

export interface TeamMember extends User {
  department: string;
  joinedAt: string;
  spacesCount: number;
}

export type { 
  HairStyle, OutfitType, OutfitPattern, AccessoryType, EyeShape, 
  MouthType, FacialHair, FaceShape, AvatarConfig 
} from '@chitchat/types';

export { DEFAULT_AVATAR_CONFIG } from '@chitchat/types';

export interface PlacedElement {
  id: string;
  assetId: string;
  x: number;
  y: number;
  rotation?: number;
  customColor?: string;
  customTexture?: string;
  /** Per-instance actions. If set, these OVERRIDE the asset's defaultActions. */
  actions?: ElementAction[];
}

export type BackgroundTheme = 'dark-tiles' | 'wood-floor' | 'blue-carpet' | 'concrete' | 'grass' | 'marble' | 'sand';

export interface Template {
  id: string;
  title: string;
  description?: string;
  iconName?: string;
  color: string;
  bgTheme?: BackgroundTheme;
  elements: PlacedElement[];
}

export interface CanvasData {
  id: string;
  name?: string;
  description?: string;
  bgTheme: BackgroundTheme;
  bgColor: string;
  elements: PlacedElement[];
  updatedAt: number;
}
