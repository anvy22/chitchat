// ─── Message ──────────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'system' | 'reaction';

export interface Message {
  id: string;
  spaceId: string;
  userId: string;
  userName: string;         // denormalised for display speed
  userAvatarConfig?: unknown; // AvatarConfig — typed as unknown to avoid circular dep; cast on use
  content: string;
  type: MessageType;
  createdAt: string;        // ISO 8601
}

// ─── DTO ─────────────────────────────────────────────────────────────────────

export interface SendMessageDto {
  spaceId: string;
  content: string;
  type?: MessageType;
}

// ─── Paginated response ───────────────────────────────────────────────────────

export interface MessagesPage {
  data: Message[];
  nextCursor: string | null; // created_at of oldest message in this page
  hasMore: boolean;
}
