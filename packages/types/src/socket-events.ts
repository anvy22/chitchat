import type { UserSummary } from './user';
import type { Message } from './message';
import type { AvatarPosition, GeoLocation } from './location';

// ─── Client → Server events ───────────────────────────────────────────────────

export interface ClientToServerEvents {
  /** Join a space room */
  'space:join': (payload: { spaceId: string }) => void;

  /** Leave a space room */
  'space:leave': (payload: { spaceId: string }) => void;

  /**
   * Throttled avatar movement update (target: 15 fps).
   * Server fans out to all other users in the space.
   */
  'avatar:move': (payload: Omit<AvatarPosition, 'userId'>) => void;

  /** Send a chat message to the space */
  'message:send': (payload: { spaceId: string; content: string; type?: Message['type'] }) => void;

  /** Broadcast typing indicator */
  'message:typing': (payload: { spaceId: string; isTyping: boolean }) => void;

  /** Keep-alive heartbeat to maintain presence */
  'presence:heartbeat': () => void;

  /** Geo-location update (for map features) */
  'location:update': (payload: { lat: number; lng: number; accuracy?: number }) => void;
}

// ─── Server → Client events ───────────────────────────────────────────────────

export interface ServerToClientEvents {
  /** Full space state snapshot sent on join */
  'space:state': (payload: { users: UserSummary[]; messages: Message[] }) => void;

  /** Another user's avatar moved */
  'avatar:moved': (payload: AvatarPosition) => void;

  /** New message posted in the space */
  'message:new': (payload: { message: Message }) => void;

  /** Typing indicator from another user */
  'message:typing': (payload: { userId: string; isTyping: boolean }) => void;

  /** A user joined the space */
  'presence:joined': (payload: { user: UserSummary }) => void;

  /** A user left the space */
  'presence:left': (payload: { userId: string }) => void;

  /** Full presence list refresh */
  'presence:sync': (payload: { users: UserSummary[] }) => void;

  /** Geo-location broadcast from another user */
  'location:broadcast': (payload: GeoLocation) => void;

  /** Server-side error */
  'error': (payload: { code: string; message: string }) => void;
}

// ─── Inter-server events (Socket.io Redis adapter) ───────────────────────────

export interface InterServerEvents {
  ping: () => void;
}

// ─── Per-socket data (stored in socket.data) ─────────────────────────────────

export interface SocketData {
  userId: string;
  email: string;
  role: string;
  workspaceId: string;
  jti: string;
}
