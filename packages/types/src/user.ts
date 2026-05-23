// ─── Avatar Config ────────────────────────────────────────────────────────────

export type HairStyle = 'crew-cut' | 'medium' | 'long' | 'curly' | 'ponytail' | 'bun' | 'bald';
export type OutfitType = 'tshirt' | 'hoodie' | 'suit' | 'dress' | 'tank-top';
export type OutfitPattern = 'solid' | 'stripes' | 'dots' | 'checkered' | 'camo';
export type AccessoryType = 'none' | 'glasses' | 'headphones' | 'hat' | 'earrings' | 'mask';
export type EyeShape = 'normal' | 'squint' | 'wide' | 'cool';
export type MouthType = 'smile' | 'neutral' | 'surprised' | 'cool';
export type FacialHair = 'none' | 'beard' | 'mustache' | 'stubble';
export type FaceShape = 'oval' | 'round' | 'square' | 'heart';

export interface AvatarConfig {
  skinTone: string;
  faceShape: FaceShape;
  hairStyle: HairStyle;
  hairColor: string;
  facialHair: FacialHair;
  outfit: OutfitType;
  outfitPattern: OutfitPattern;
  outfitColor: string;
  accessory: AccessoryType;
  eyeColor: string;
  eyeShape: EyeShape;
  mouth: MouthType;
  photoUrl?: string;
  generatedFromPhoto?: boolean;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: '#E8A87C',
  faceShape: 'oval',
  hairStyle: 'medium',
  hairColor: '#4A2F1D',
  facialHair: 'none',
  outfit: 'tshirt',
  outfitPattern: 'solid',
  outfitColor: '#6D3BD7',
  accessory: 'none',
  eyeColor: '#1E293B',
  eyeShape: 'normal',
  mouth: 'smile',
};

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';
export type UserRole = 'admin' | 'member' | 'guest';

/** Full profile as stored in DB / returned by REST API */
export interface UserProfile {
  id: string;          // Supabase UUID
  name: string;
  email: string;
  avatarConfig: AvatarConfig;
  photoUrl?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;   // ISO 8601
  updatedAt: string;
}

/** Lightweight user representation used in space presence / messages */
export interface UserSummary {
  id: string;
  name: string;
  avatarConfig: AvatarConfig;
  status: UserStatus;
}

/** PATCH /api/users/me request body */
export interface UpdateProfileDto {
  name?: string;
  avatarConfig?: Partial<AvatarConfig>;
  photoUrl?: string;
  status?: UserStatus;
}
