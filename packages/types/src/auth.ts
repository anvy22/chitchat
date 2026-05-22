// ─── Auth ─────────────────────────────────────────────────────────────────────

export type AuthRole = 'admin' | 'member' | 'guest';

/** Custom JWT payload (both access + refresh share the same shape) */
export interface JwtPayload {
  sub: string;           // Supabase user UUID
  email: string;
  role: AuthRole;
  workspaceId: string;
  jti: string;           // unique token ID — used for blocklist on logout
  iat: number;
  exp: number;
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
}

/** POST /api/auth/oauth-callback → 200 */
export interface OAuthCallbackResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: AuthRole;
  };
  accessToken: string;
}

/** POST /api/auth/refresh → 200 */
export interface RefreshResponse {
  accessToken: string;
}
