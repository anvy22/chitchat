# ChitChat — Backend Architecture Plan

> **Scope:** Production-grade, scalable multi-user real-time platform.
> Stack: `apps/api` (Express REST) · `apps/realtime` (Socket.io) · `apps/frontend` (Next.js, client-only) · `apps/ml` · Supabase (Postgres + Auth)

---

## 1. Current State Analysis

| Layer | Current | Problem |
|---|---|---|
| Auth | Static mock (`u1 / Dale Cooper`) | No real sessions, no security |
| Data | `localStorage` / mock arrays | Not persistent, not multi-user |
| Real-time | None | No WebSocket server exists |
| API | In-component fetch | No REST layer |
| Presence | None | Cannot track online users |
| Chat | Mock array | No persistence, no broadcast |
| Location | None | No streaming infrastructure |

### Key Concerns
- **Security:** No auth on any endpoint; JWT never validated
- **Scalability:** localStorage is single-device, single-user
- **Maintainability:** Business logic scattered in React components
- **Real-time:** No WebSocket server — `apps/realtime/` is empty
- **API:** No REST server — `apps/api/` is empty
- **No server actions:** Frontend is pure client; all backend calls go via REST (`/api`) or Socket.io

---

## 2. Target Monorepo Layout

```
chitchat-app/
├── apps/
│   ├── frontend/          # Next.js — pure client, NO server actions
│   ├── api/               # Express REST API server
│   ├── realtime/          # Socket.io WebSocket server
│   └── ml/                # Python / Node ML microservice
├── packages/
│   ├── types/             # Shared TypeScript interfaces (DB + API)
│   ├── config/            # Shared env schema (zod)
│   ├── ui/                # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
└── supabase/
    ├── config.toml
    ├── migrations/
    └── seed.sql
```

---

## 3. `apps/api` — REST API Server

### 3.1 Technology

| Choice | Rationale |
|---|---|
| **Express + TypeScript** | Mature, well-understood, easy middleware |
| **Zod** | Runtime schema validation |
| **jsonwebtoken** | Custom JWT sign/verify |
| **@supabase/supabase-js** (service role) | DB access with admin rights |
| **ioredis** | Caching, rate-limit counters, pub/sub bridge |
| **pino** | Structured JSON logging |
| **helmet + cors** | Security headers |

### 3.2 Folder Structure

```
apps/api/src/
├── index.ts               # Entry point, Express bootstrap
├── config/
│   └── env.ts             # Zod-validated env (PORT, JWT_SECRET, SUPABASE_*, REDIS_URL)
├── middleware/
│   ├── authenticate.ts    # JWT verify → req.user
│   ├── authorize.ts       # Role/permission guard factory
│   ├── rateLimiter.ts     # Redis sliding-window rate limit
│   ├── validate.ts        # Zod body/query/param validator
│   ├── errorHandler.ts    # Global error handler
│   └── requestLogger.ts   # Pino request logging
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.routes.ts
│   ├── spaces/
│   │   ├── spaces.controller.ts
│   │   ├── spaces.service.ts
│   │   └── spaces.routes.ts
│   ├── messages/
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   └── messages.routes.ts
│   └── assets/
│       ├── assets.controller.ts
│       ├── assets.service.ts
│       └── assets.routes.ts
├── lib/
│   ├── supabase.ts        # Supabase admin client (service role)
│   ├── redis.ts           # ioredis singleton
│   ├── jwt.ts             # signToken / verifyToken / refreshToken
│   └── AppError.ts        # Typed error class
└── types/
    └── express.d.ts       # Augment req.user
```

### 3.3 REST Endpoints

```
POST   /api/auth/oauth-callback    # Exchange Supabase OAuth code → custom JWT
POST   /api/auth/refresh           # Refresh custom JWT
POST   /api/auth/logout            # Invalidate refresh token

GET    /api/users/me               # Own profile
PATCH  /api/users/me               # Update profile / avatar config
GET    /api/users/:id              # Public profile

GET    /api/spaces                 # List workspace spaces
POST   /api/spaces                 # Create space
GET    /api/spaces/:id             # Get space
PATCH  /api/spaces/:id             # Update space
DELETE /api/spaces/:id             # Delete space

GET    /api/spaces/:id/messages    # Paginated messages (cursor)
POST   /api/spaces/:id/messages    # Post message

GET    /api/assets                 # Asset catalog
GET    /api/assets/:id
```

---

## 4. `apps/realtime` — Socket.io Server

### 4.1 Technology

| Choice | Rationale |
|---|---|
| **Socket.io + TypeScript** | Battle-tested, rooms, namespaces, reconnect |
| **socket.io-redis-adapter** | Horizontal scaling across multiple nodes |
| **ioredis** | Pub/sub for adapter + presence store |
| **jsonwebtoken** | Token validation in socket handshake |

### 4.2 Folder Structure

```
apps/realtime/src/
├── index.ts               # HTTP + Socket.io bootstrap
├── config/
│   └── env.ts             # PORT, JWT_SECRET, REDIS_URL, CORS_ORIGIN
├── middleware/
│   └── socketAuth.ts      # JWT handshake middleware
├── namespaces/
│   ├── space.namespace.ts # /space — avatar movement, chat, presence
│   └── global.namespace.ts# / — cross-space notifications
├── handlers/
│   ├── presence.handler.ts   # join/leave, heartbeat
│   ├── location.handler.ts   # avatar_move broadcast
│   ├── chat.handler.ts       # message:send, message:typing
│   └── room.handler.ts       # room join/leave, capacity
├── services/
│   ├── presence.service.ts   # Redis presence store (HSET/HGET/HDEL)
│   └── broadcast.service.ts  # Throttled emit helpers
└── lib/
    ├── redis.ts           # ioredis singleton
    └── supabase.ts        # Supabase admin (write messages to DB)
```

### 4.3 Socket Events

**Client → Server:**
```
space:join          { spaceId, token }
space:leave         { spaceId }
avatar:move         { x, y, facing, state }     (throttled 15fps)
message:send        { spaceId, content, type }
message:typing      { spaceId, isTyping }
presence:heartbeat  {}
location:update     { lat, lng, accuracy }       (live location)
```

**Server → Client:**
```
space:state         { users[], messages[] }      (on join)
avatar:moved        { userId, x, y, facing, state }
message:new         { message }
message:typing      { userId, isTyping }
presence:joined     { user }
presence:left       { userId }
presence:sync       { users[] }
location:broadcast  { userId, lat, lng }
error               { code, message }
```

---

## 5. Authentication Architecture

### 5.1 Flow Overview

```
1. Frontend → Supabase Auth (OAuth: Google / GitHub)
2. Supabase → redirects to /callback with ?code=...
3. Frontend → POST /api/auth/oauth-callback { code }
4. API: exchangeCodeForSession(code) via Supabase Admin
5. API: issues own short-lived Access JWT (15min) + Refresh JWT (7d)
6. API: stores refresh token hash in Redis (key: refresh:{userId})
7. Frontend: stores Access JWT in memory, Refresh JWT in httpOnly cookie
8. All REST calls: Authorization: Bearer <accessJwt>
9. Socket handshake: auth: { token: accessJwt }
10. On 401: POST /api/auth/refresh → new token pair
```

### 5.2 JWT Payload

```ts
interface JwtPayload {
  sub: string;        // Supabase user UUID
  email: string;
  role: 'admin' | 'member' | 'guest';
  workspaceId: string;
  iat: number;
  exp: number;
  jti: string;        // Unique token ID (for replay protection)
}
```

### 5.3 Token Strategy

| Token | Storage | TTL | Transport |
|---|---|---|---|
| Access JWT | JS memory (React state/context) | 15 min | Authorization header |
| Refresh JWT | httpOnly Secure cookie | 7 days | Sent automatically |
| Socket token | Same access JWT | 15 min | `socket.auth.token` |

### 5.4 `authenticate.ts` Middleware

```ts
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError(401, 'UNAUTHORIZED');

  const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  // Replay protection: check jti not in Redis blocklist
  const blocked = await redis.get(`jti:blocked:${payload.jti}`);
  if (blocked) throw new AppError(401, 'TOKEN_REVOKED');

  req.user = payload;
  next();
});
```

### 5.5 Socket Auth Middleware

```ts
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('UNAUTHORIZED'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    socket.data.user = payload;
    next();
  } catch {
    next(new Error('INVALID_TOKEN'));
  }
});
```

### 5.6 Role / Permission System

```ts
// Roles: 'admin' | 'member' | 'guest'
export const authorize = (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) throw new AppError(403, 'FORBIDDEN');
    next();
  };

// Usage
router.delete('/spaces/:id', authenticate, authorize('admin', 'member'), spacesController.delete);
```

---

## 6. Real-time Infrastructure

### 6.1 Live Location Streaming

```
Client emits location:update every 2s (throttled)
  → server validates (distance sanity check)
  → server broadcasts location:broadcast to space room
  → other clients render moving pins on canvas

Storage: Redis HSET location:{spaceId} userId JSON.stringify({lat, lng, ts})
TTL: auto-expire after 30s of inactivity (sliding window)
DB: location snapshots written to `location_events` table every 30s for history
```

### 6.2 Presence Tracking

```
On space:join:
  - socket joins room `space:{spaceId}`
  - Redis HSET presence:{spaceId} userId JSON.stringify({name, avatar, joinedAt})
  - emit presence:joined to room

On disconnect / space:leave:
  - Redis HDEL presence:{spaceId} userId
  - emit presence:left to room

Heartbeat: client emits presence:heartbeat every 20s
  - server resets TTL on Redis key
  - stale keys (no heartbeat) expire after 60s → triggers presence:left
```

### 6.3 Room / Channel Management

```
Namespaces:
  /space    → virtual spaces (avatar movement, chat, presence, location)
  /         → global (cross-space notifications, system announcements)

Rooms (within /space namespace):
  space:{spaceId}   → all users in a space
  dm:{userId1}:{userId2} (sorted) → private DMs (future)

Capacity enforcement:
  On space:join → check Redis presence count vs space.maxCapacity
  If full: emit error { code: 'SPACE_FULL' }
```

### 6.4 Chat Architecture

```
message:send flow:
  1. Client emits message:send { spaceId, content }
  2. Server validates (length, rate limit per user/space)
  3. Server writes to Supabase messages table (async)
  4. Server emits message:new to space:{spaceId} room
  5. All clients update local state

Typing indicators:
  - Client emits message:typing { spaceId, isTyping: true }
  - Server emits typing:update { userId, isTyping } to room (excluding sender)
  - Auto-clear after 3s server-side timer

Pagination:
  - REST GET /api/spaces/:id/messages?cursor=<messageId>&limit=50
  - Cursor-based (created_at DESC)
  - Socket delivers only new messages (no historical load via socket)
```

---

## 7. Database Schema (Supabase Postgres)

```sql
-- profiles (extends auth.users)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  avatar_config JSONB NOT NULL DEFAULT '{}',
  photo_url     TEXT,
  status        TEXT NOT NULL DEFAULT 'online'
                  CHECK (status IN ('online','away','busy','offline')),
  role          TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('admin','member','guest')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- workspaces
CREATE TABLE public.workspaces (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  owner_id   UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- workspace_members
CREATE TABLE public.workspace_members (
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member'
                 CHECK (role IN ('owner','admin','member','guest')),
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- spaces (virtual rooms / canvases)
CREATE TABLE public.spaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'Untitled Space',
  description   TEXT DEFAULT '',
  bg_theme      TEXT NOT NULL DEFAULT 'dark-tiles',
  bg_color      TEXT NOT NULL DEFAULT '',
  elements      JSONB NOT NULL DEFAULT '[]',  -- PlacedElement[]
  type          TEXT NOT NULL DEFAULT 'office'
                  CHECK (type IN ('office','meeting','lounge','event')),
  max_capacity  INT NOT NULL DEFAULT 50,
  is_live       BOOLEAN NOT NULL DEFAULT FALSE,
  created_by    UUID NOT NULL REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- messages
CREATE TABLE public.messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id   UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text','system','reaction')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- location_events (audit / history)
CREATE TABLE public.location_events (
  id         BIGSERIAL PRIMARY KEY,
  space_id   UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  x          FLOAT NOT NULL,
  y          FLOAT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- assets (static catalog)
CREATE TABLE public.assets (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('furniture','decoration','zone','interactive')),
  icon            TEXT NOT NULL,
  color           TEXT NOT NULL,
  width           INT NOT NULL,
  height          INT NOT NULL,
  collision       TEXT CHECK (collision IN ('solid','partial','none')),
  default_actions JSONB DEFAULT '[]'
);

-- Indexes
CREATE INDEX idx_spaces_workspace ON public.spaces(workspace_id);
CREATE INDEX idx_messages_space   ON public.messages(space_id, created_at DESC);
CREATE INDEX idx_members_user     ON public.workspace_members(user_id);
CREATE INDEX idx_location_space   ON public.location_events(space_id, recorded_at DESC);
```

### Row Level Security

```sql
-- All tables enable RLS; API server uses service role key (bypasses RLS)
-- Frontend never touches DB directly; all data flows through apps/api or apps/realtime
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- Service role key used in apps/api and apps/realtime bypasses all RLS policies
```

---

## 8. Caching Strategy (Redis)

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `presence:{spaceId}` | Hash | 60s (sliding) | Online users per space |
| `location:{spaceId}` | Hash | 30s (sliding) | Live positions |
| `space:{id}:meta` | String (JSON) | 5min | Space metadata cache |
| `user:{id}:profile` | String (JSON) | 10min | Profile cache |
| `refresh:{userId}` | String | 7d | Refresh token hash |
| `jti:blocked:{jti}` | String | token TTL | Revoked JTI blocklist |
| `ratelimit:{ip}:{route}` | Counter | 1min | Sliding-window rate limit |
| `typing:{spaceId}:{userId}` | String | 3s | Typing indicator TTL |

---

## 9. Rate Limiting

```ts
// apps/api/src/middleware/rateLimiter.ts
const limits: Record<string, { max: number; windowMs: number }> = {
  'POST /api/auth':             { max: 10,   windowMs: 60_000 },
  'POST /api/spaces/:id/messages': { max: 30, windowMs: 60_000 },
  'PATCH /api/users/me':        { max: 20,   windowMs: 60_000 },
  'default':                    { max: 100,  windowMs: 60_000 },
};

// Socket.io: per-user, per-event rate limiting
// avatar:move   → max 20/s  (client throttles to 15fps, server enforces)
// message:send  → max 1/s
// location:update → max 1/2s
```

---

## 10. Logging & Monitoring

```
apps/api:
  - pino HTTP request logger (method, path, status, latency)
  - Structured error logs with stack traces (dev) / sanitized (prod)
  - Log levels: error > warn > info > debug

apps/realtime:
  - Socket connect/disconnect events (userId, socketId, spaceId)
  - Event throughput counters (Prometheus metrics endpoint /metrics)

Monitoring stack (recommended):
  - Prometheus + Grafana for metrics (connections, events/s, errors)
  - Sentry for error tracking (both servers)
  - Uptime: healthcheck endpoints GET /health on both servers
```

---

## 11. Security Best Practices

### JWT Security
- Short-lived access tokens (15min), rotated refresh tokens (7d)
- `jti` (JWT ID) in every token — Redis blocklist on logout/revoke
- Secrets in env vars only, never hardcoded
- Algorithm pinned to `HS256`; validate `iss`, `aud`, `exp`

### OAuth Integration
- PKCE flow via Supabase Auth
- Callback URL allowlist strictly configured in Supabase dashboard
- State parameter validated to prevent CSRF on callback

### Socket Security
- JWT validated on every handshake (not just connection)
- Re-validate token on reconnect (short-lived tokens expire)
- Socket joins rooms only for spaces the user is a member of (DB check)
- Per-event payload size limits (message max 2000 chars)

### Replay Protection
- `jti` stored in Redis; blacklisted on logout
- Idempotency keys on message:send to deduplicate retries

### Abuse Prevention
- Redis sliding-window rate limits on REST + Socket events
- IP-based blocking on auth endpoints after 10 failed attempts
- Content length checks on all string inputs
- Zod validation on all REST request bodies and Socket payloads

### Data Validation
- Zod schemas for every REST endpoint (body, params, query)
- Socket payloads validated with Zod in each handler
- Sanitize content before DB write (strip HTML)

---

## 12. `packages/types` — Shared Types

```ts
// packages/types/src/index.ts — consumed by api, realtime, and frontend
export * from './auth';
export * from './user';
export * from './space';
export * from './message';
export * from './socket-events';
export * from './location';
```

All three apps import from `@chitchat/types` — single source of truth for all interfaces.

---

## 13. Frontend Integration (No Server Actions)

```
All data fetching: fetch() → apps/api (REST)
All real-time:     socket.io-client → apps/realtime (WebSocket)

Frontend responsibilities:
  - Store access JWT in React Context / Zustand (memory only)
  - Refresh JWT cookie set by api server (httpOnly, Secure, SameSite=Lax)
  - On 401: auto-call POST /api/auth/refresh, retry original request
  - Socket connects with access JWT in socket.auth.token
  - Re-connect and re-auth on token refresh

Auth flow in frontend:
  1. User clicks "Login with Google"
  2. Frontend redirects to Supabase OAuth URL
  3. Supabase redirects to /auth/callback?code=...
  4. Frontend page calls POST /api/auth/oauth-callback { code }
  5. API returns { accessToken, user } + sets refresh cookie
  6. Frontend stores accessToken in memory, navigates to /dashboard
```

---

## 14. Implementation Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Initialize `apps/api` with Express + TypeScript + pino
- [ ] Initialize `apps/realtime` with Socket.io + TypeScript
- [ ] Set up `packages/types` with all shared interfaces
- [ ] Set up `packages/config` with Zod env schemas
- [ ] Configure Turbo pipelines for both servers
- [ ] Supabase: run initial migration, seed assets table
- [ ] Redis: provision instance (local Docker for dev)
- [ ] Implement `lib/jwt.ts`, `lib/supabase.ts`, `lib/redis.ts` in both apps

### Phase 2 — Auth (Week 2–3)
- [ ] `POST /api/auth/oauth-callback` — issue custom JWT pair
- [ ] `POST /api/auth/refresh` — rotate tokens
- [ ] `POST /api/auth/logout` — revoke refresh, blocklist jti
- [ ] `authenticate` middleware with jti blocklist check
- [ ] Socket `socketAuth` middleware
- [ ] Frontend: OAuth callback page, token storage, axios interceptor for refresh
- [ ] `authorize` role guard middleware

### Phase 3 — REST API (Week 3–4)
- [ ] Users module (GET /me, PATCH /me)
- [ ] Spaces module (CRUD)
- [ ] Messages module (list + create with pagination)
- [ ] Assets module (read-only catalog)
- [ ] Rate limiting middleware
- [ ] Zod validation middleware
- [ ] Error handler middleware
- [ ] Global request logger

### Phase 4 — Real-time (Week 4–5)
- [ ] Space namespace setup with Redis adapter
- [ ] `presence.handler.ts` — join/leave/heartbeat/sync
- [ ] `location.handler.ts` — avatar move broadcast (throttled)
- [ ] `chat.handler.ts` — message:send, typing indicators
- [ ] `room.handler.ts` — capacity enforcement
- [ ] Live location streaming (`location:update` → `location:broadcast`)
- [ ] Frontend: socket.io-client integration, hooks for each event

### Phase 5 — Frontend Migration (Week 5–6)
- [ ] Replace `localStorage` canvas service with REST calls to `apps/api`
- [ ] Replace `localStorage` avatar service with REST calls
- [ ] Replace `useAuthUser` mock with real JWT-backed auth
- [ ] Replace mock messages with real-time chat via Socket.io
- [ ] Replace mock team members with real API data
- [ ] Implement presence UI (online indicators)
- [ ] Implement live avatar movement for other users

### Phase 6 — Production Hardening (Week 7–8)
- [ ] Horizontal scaling: Socket.io Redis adapter, API load balancer
- [ ] Sentry integration (both servers)
- [ ] Prometheus metrics + Grafana dashboards
- [ ] `GET /health` endpoints
- [ ] Docker images for `apps/api` and `apps/realtime`
- [ ] CI/CD pipelines
- [ ] Supabase Storage: avatar photos, space thumbnails
- [ ] Full load test (k6) targeting 1000 concurrent users

---

## 15. Environment Variables

### `apps/api/.env`
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=<strong-secret-32-chars-min>
JWT_ACCESS_TTL=900          # 15 minutes
JWT_REFRESH_TTL=604800      # 7 days
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

### `apps/realtime/.env`
```env
PORT=4001
NODE_ENV=development
JWT_SECRET=<same-as-api>
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

### `apps/frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_REALTIME_URL=http://localhost:4001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # Used for OAuth redirect only
```

---

## 16. Scalability Architecture

```
                      ┌─────────────────────────────┐
                      │       Load Balancer          │
                      │   (nginx / AWS ALB)          │
                      └──────────┬──────────────────┘
                         ┌───────┴────────┐
                         ▼                ▼
               ┌──────────────┐  ┌──────────────────┐
               │  apps/api    │  │  apps/realtime   │
               │  (N replicas)│  │  (N replicas)    │
               └──────┬───────┘  └────────┬─────────┘
                      │                   │
               ┌──────▼───────────────────▼─────────┐
               │            Redis Cluster            │
               │  (presence, location, pub/sub,      │
               │   sessions, rate limits, cache)     │
               └──────────────┬──────────────────────┘
                              │
               ┌──────────────▼──────────────────────┐
               │         Supabase Postgres            │
               │   (profiles, spaces, messages,       │
               │    assets, location_events)          │
               └──────────────────────────────────────┘
```

**Scaling notes:**
- `apps/api`: stateless → scale horizontally behind ALB
- `apps/realtime`: stateful sockets → scale with Redis pub/sub adapter; sticky sessions optional but not required
- Redis: use Redis Sentinel or Redis Cluster for HA
- Supabase: built-in PgBouncer connection pooling; use read replicas for heavy reads
- Avatar movement: throttle client-side to 15fps; server drops events above 20/s per user

---

## 17. Commands Cheat Sheet

```bash
# Start all services (Turbo)
pnpm dev

# Start individual services
pnpm --filter api dev
pnpm --filter realtime dev
pnpm --filter frontend dev

# Supabase local dev
npx supabase start
npx supabase db push
npx supabase gen types typescript --local > packages/types/src/db.ts

# Redis (Docker)
docker run -d -p 6379:6379 redis:alpine

# Type check all packages
pnpm check-types

# Build all
pnpm build
```

---

## 18. Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TanStack Query, socket.io-client, Axios |
| REST API | Express, TypeScript, Zod, jsonwebtoken, pino, helmet |
| WebSocket | Socket.io, socket.io-redis-adapter |
| Auth | Supabase Auth (OAuth), Custom JWT (access + refresh) |
| Database | Supabase Postgres (Row Level Security) |
| Cache / Presence | Redis (ioredis) |
| Monorepo | Turborepo + pnpm workspaces |
| Shared Types | `packages/types` (consumed by all apps) |
| Monitoring | Pino logs, Prometheus metrics, Sentry |
| CI/CD | GitHub Actions + Docker |
