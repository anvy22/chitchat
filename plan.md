# ChitChat — Backend Architecture Plan

> **Stack:** `apps/api` (Express REST) · `apps/realtime` (Socket.io) · `apps/frontend` (Next.js, client-only) · `apps/ml` · Supabase Postgres + Auth · Redis

---

## 1. Monorepo Layout

```
chitchat-app/
├── apps/
│   ├── frontend/                    # Next.js — pure client, NO server actions
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/
│   │       │   │   ├── sign-in/page.tsx
│   │       │   │   ├── sign-up/page.tsx
│   │       │   │   └── callback/page.tsx   # OAuth callback → POST /api/auth/oauth-callback
│   │       │   └── (dashboard)/
│   │       ├── lib/
│   │       │   ├── api-client.ts           # Axios instance w/ JWT + refresh interceptor
│   │       │   └── socket-client.ts        # socket.io-client singleton
│   │       ├── hooks/
│   │       │   ├── use-auth.ts             # JWT context consumer
│   │       │   ├── use-queries.ts          # TanStack Query hooks → apps/api
│   │       │   ├── use-realtime.ts         # Socket.io hooks → apps/realtime
│   │       │   └── use-canvas.ts
│   │       ├── services/
│   │       │   ├── api.ts                  # REST service wrappers
│   │       │   ├── avatar-service.ts       # → PATCH /api/users/me
│   │       │   └── canvas/canvas-service.ts# → /api/spaces
│   │       └── types/index.ts
│   │
│   ├── api/                         # Express REST API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── config/env.ts
│   │       ├── lib/
│   │       │   ├── supabase.ts
│   │       │   ├── redis.ts
│   │       │   ├── jwt.ts
│   │       │   └── AppError.ts
│   │       ├── middleware/
│   │       │   ├── authenticate.ts
│   │       │   ├── authorize.ts
│   │       │   ├── rateLimiter.ts
│   │       │   ├── validate.ts
│   │       │   ├── errorHandler.ts
│   │       │   └── requestLogger.ts
│   │       └── modules/
│   │           ├── auth/
│   │           │   ├── auth.routes.ts
│   │           │   ├── auth.controller.ts
│   │           │   ├── auth.service.ts
│   │           │   └── auth.schema.ts
│   │           ├── users/
│   │           │   ├── users.routes.ts
│   │           │   ├── users.controller.ts
│   │           │   └── users.service.ts
│   │           ├── spaces/
│   │           │   ├── spaces.routes.ts
│   │           │   ├── spaces.controller.ts
│   │           │   └── spaces.service.ts
│   │           ├── messages/
│   │           │   ├── messages.routes.ts
│   │           │   ├── messages.controller.ts
│   │           │   └── messages.service.ts
│   │           └── assets/
│   │               ├── assets.routes.ts
│   │               ├── assets.controller.ts
│   │               └── assets.service.ts
│   │
│   ├── realtime/                    # Socket.io WebSocket server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── config/env.ts
│   │       ├── lib/
│   │       │   ├── redis.ts
│   │       │   └── supabase.ts
│   │       ├── middleware/
│   │       │   └── socketAuth.ts
│   │       ├── namespaces/
│   │       │   ├── space.namespace.ts
│   │       │   └── global.namespace.ts
│   │       ├── handlers/
│   │       │   ├── presence.handler.ts
│   │       │   ├── location.handler.ts
│   │       │   ├── chat.handler.ts
│   │       │   └── room.handler.ts
│   │       └── services/
│   │           ├── presence.service.ts
│   │           └── broadcast.service.ts
│   │
│   └── ml/                          # ML microservice (future)
│
├── packages/
│   ├── types/                       # Shared TS types (api + realtime + frontend)
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── space.ts
│   │       ├── message.ts
│   │       ├── socket-events.ts
│   │       └── location.ts
│   ├── config/
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
│
└── supabase/
    ├── config.toml
    ├── migrations/
    │   └── 00001_initial_schema.sql
    └── seed.sql
```

---

## 2. Authentication Flow

```
1.  User clicks "Login with Google"
2.  Frontend redirects → Supabase OAuth URL
3.  Supabase redirects → /auth/callback?code=...
4.  Frontend page: POST /api/auth/oauth-callback { code }
5.  API: supabase.auth.exchangeCodeForSession(code)
6.  API: issues Access JWT (15min) + Refresh JWT (7d)
7.  API: stores hashed refresh token in Redis (refresh:{userId})
8.  API: returns { accessToken, user }; sets httpOnly refresh cookie
9.  Frontend: stores accessToken in memory (AuthContext)
10. REST calls: Authorization: Bearer <accessToken>
11. Socket.io: socket.auth = { token: accessToken }
12. On 401: POST /api/auth/refresh → rotate tokens
```

### JWT Payload
```ts
interface JwtPayload {
  sub: string;          // Supabase user UUID
  email: string;
  role: 'admin' | 'member' | 'guest';
  workspaceId: string;
  jti: string;          // Unique ID — used for blocklist on logout
  iat: number;
  exp: number;
}
```

| Token | Storage | TTL | Transport |
|---|---|---|---|
| Access JWT | React AuthContext (memory) | 15 min | Authorization header |
| Refresh JWT | httpOnly Secure cookie | 7 days | Automatic via cookie |
| Socket token | Same access JWT | 15 min | `socket.auth.token` |

---

## 3. REST API Endpoints (`apps/api` — port 4000)

```
POST   /api/auth/oauth-callback    Exchange Supabase code → custom JWT pair
POST   /api/auth/refresh           Rotate refresh token
POST   /api/auth/logout            Revoke refresh, blocklist jti

GET    /api/users/me               Own profile
PATCH  /api/users/me               Update profile / avatar config
GET    /api/users/:id              Public profile

GET    /api/spaces                 List spaces
POST   /api/spaces                 Create space
GET    /api/spaces/:id             Get space
PATCH  /api/spaces/:id             Update space
DELETE /api/spaces/:id             Delete space

GET    /api/spaces/:id/messages    Paginated messages (cursor-based)
POST   /api/spaces/:id/messages    Post message

GET    /api/assets                 Asset catalog
GET    /api/assets/:id             Single asset
```

---

## 4. Socket.io Events (`apps/realtime` — port 4001)

### Namespace `/space`

**Client → Server**
```
space:join          { spaceId }
space:leave         { spaceId }
avatar:move         { x, y, facing, state }     throttled 15fps
message:send        { spaceId, content, type }
message:typing      { spaceId, isTyping }
presence:heartbeat  {}
location:update     { lat, lng, accuracy }
```

**Server → Client**
```
space:state         { users[], messages[] }     on join
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

## 5. Database Schema

```sql
-- profiles
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

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- spaces
CREATE TABLE public.spaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'Untitled Space',
  description   TEXT DEFAULT '',
  bg_theme      TEXT NOT NULL DEFAULT 'dark-tiles',
  bg_color      TEXT NOT NULL DEFAULT '',
  elements      JSONB NOT NULL DEFAULT '[]',
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

-- location_events
CREATE TABLE public.location_events (
  id          BIGSERIAL PRIMARY KEY,
  space_id    UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  x           FLOAT NOT NULL,
  y           FLOAT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- assets
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

-- RLS (apps/api and apps/realtime use service role key — bypasses RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets   ENABLE ROW LEVEL SECURITY;
```

---

## 6. Redis Key Reference

| Key | Type | TTL | Purpose |
|---|---|---|---|
| `presence:{spaceId}` | Hash | 60s sliding | Online users per space |
| `location:{spaceId}` | Hash | 30s sliding | Live avatar positions |
| `space:{id}:meta` | String JSON | 5min | Space metadata cache |
| `user:{id}:profile` | String JSON | 10min | Profile cache |
| `refresh:{userId}` | String | 7d | Hashed refresh token |
| `jti:blocked:{jti}` | String | token TTL | Revoked JTI blocklist |
| `ratelimit:{ip}:{route}` | Counter | 1min | Sliding-window rate limit |
| `typing:{spaceId}:{userId}` | String | 3s | Typing indicator TTL |

---

## 7. Rate Limits

| Route / Event | Limit |
|---|---|
| `POST /api/auth/*` | 10 req / min / IP |
| `POST /api/spaces/:id/messages` | 30 req / min / user |
| `PATCH /api/users/me` | 20 req / min / user |
| Default REST | 100 req / min / IP |
| Socket `avatar:move` | 20 events / sec / user |
| Socket `message:send` | 1 event / sec / user |
| Socket `location:update` | 1 event / 2sec / user |

---

## 8. Environment Variables

### `apps/api/.env`
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=<min-32-char-secret>
JWT_ACCESS_TTL=900
JWT_REFRESH_TTL=604800
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 9. Scaling Architecture

```
                 ┌─────────────────────────────┐
                 │        Load Balancer         │
                 └──────────┬──────────────────┘
                    ┌───────┴────────┐
                    ▼                ▼
          ┌──────────────┐  ┌─────────────────┐
          │  apps/api    │  │  apps/realtime  │
          │  (N replicas)│  │  (N replicas)   │
          └──────┬───────┘  └───────┬─────────┘
                 │                  │ Redis adapter
          ┌──────▼──────────────────▼──────────┐
          │         Redis Cluster               │
          │  presence · location · pub/sub      │
          │  sessions · rate limits · cache     │
          └──────────────┬──────────────────────┘
                         │
          ┌──────────────▼──────────────────────┐
          │       Supabase Postgres             │
          │  profiles · spaces · messages       │
          │  assets · location_events           │
          └──────────────────────────────────────┘
```

---

## 10. Security Checklist

- [x] Short-lived JWT (15min) + rotating refresh tokens (7d)
- [x] `jti` blocklist in Redis on logout
- [x] httpOnly Secure SameSite=Lax cookie for refresh token
- [x] Supabase OAuth PKCE flow
- [x] Callback URL allowlist in Supabase dashboard
- [x] Socket JWT re-validated on every handshake + reconnect
- [x] Per-event payload size limits (message max 2000 chars)
- [x] Zod validation on all REST bodies, params, queries
- [x] Zod validation on all Socket.io event payloads
- [x] Redis sliding-window rate limiting (REST + Socket)
- [x] IP blocking on auth after 10 failed attempts
- [x] Helmet security headers on Express
- [x] Service role key never exposed to frontend

---

## 11. Implementation Phases

### Phase 1 — Foundation
- [ ] `packages/types` — all shared interfaces
- [ ] `apps/api` scaffolding: Express + Zod env + pino + helmet
- [ ] `apps/realtime` scaffolding: Socket.io + Zod env
- [ ] `lib/jwt.ts`, `lib/supabase.ts`, `lib/redis.ts` in both apps
- [ ] Supabase migration + seed
- [ ] Redis via Docker locally

### Phase 2 — Auth
- [ ] `POST /api/auth/oauth-callback`
- [ ] `POST /api/auth/refresh`
- [ ] `POST /api/auth/logout`
- [ ] `authenticate` middleware + jti blocklist
- [ ] `socketAuth` middleware
- [ ] Frontend: OAuth callback page, AuthContext, Axios interceptor

### Phase 3 — REST API
- [ ] Users, Spaces, Messages, Assets modules
- [ ] Rate limiting, Zod validation, error handler
- [ ] Redis caching for profiles and space metadata

### Phase 4 — Real-time
- [ ] Space namespace + Redis adapter
- [ ] Presence handler (join/leave/heartbeat)
- [ ] Location handler (avatar move broadcast)
- [ ] Chat handler (message:send, typing)
- [ ] Frontend socket hooks

### Phase 5 — Frontend Migration
- [ ] Replace localStorage canvas/avatar services with REST
- [ ] Replace mock auth with JWT AuthContext
- [ ] Replace mock messages with socket chat
- [ ] Presence UI (online indicators, user count)
- [ ] Multi-user avatar movement on canvas

### Phase 6 — Production
- [ ] Docker images for api + realtime
- [ ] Sentry error tracking
- [ ] Prometheus metrics (`/metrics` endpoint)
- [ ] `GET /health` on both servers
- [ ] Load test with k6 (target: 1000 concurrent users)
- [ ] CI/CD pipeline

---

## 12. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TanStack Query, socket.io-client, Axios |
| REST API | Express, TypeScript, Zod, jsonwebtoken, pino, helmet |
| WebSocket | Socket.io, @socket.io/redis-adapter |
| Auth | Supabase Auth (OAuth PKCE) + Custom JWT |
| Database | Supabase Postgres (RLS) |
| Cache / Presence | Redis (ioredis) |
| Monorepo | Turborepo + pnpm workspaces |
| Shared Types | `packages/types` |
| Monitoring | pino, Prometheus, Sentry |
