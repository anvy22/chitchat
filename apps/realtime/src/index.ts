import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { getSupabaseClient, getRedisClient, createRedisDuplicate, closeRedis } from '@chitchat/db';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@chitchat/types';
import pino from 'pino';

const logger = pino({
  level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  transport: process.env['NODE_ENV'] !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } }
    : undefined,
});

const PORT = parseInt(process.env['PORT'] ?? '4001', 10);
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:3000';

async function bootstrap() {
  // ── 1. Validate DB connections ───────────────────────────────────────────
  try {
    const sb = getSupabaseClient();
    const { error } = await sb.from('profiles').select('id').limit(1);
    if (error) throw new Error(`Supabase: ${error.message}`);
    logger.info('✓ Supabase connected');

    const redis = getRedisClient();
    await redis.ping();
    logger.info('✓ Redis connected');
  } catch (err) {
    logger.error({ err }, '✗ DB connection failed — aborting startup');
    process.exit(1);
  }

  // ── 2. HTTP server + Socket.io ───────────────────────────────────────────
  const httpServer = createServer();

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: { origin: CORS_ORIGIN, credentials: true },
    // Disconnect stale sockets after 60s of inactivity
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── 3. Redis adapter (pub/sub across multiple realtime instances) ─────────
  const pubClient = getRedisClient();
  const subClient = createRedisDuplicate();
  io.adapter(createAdapter(pubClient, subClient));
  logger.info('✓ Socket.io Redis adapter attached');

  // ── 4. Namespaces / handlers ─────────────────────────────────────────────
  // TODO: import and register space namespace
  // registerSpaceNamespace(io);

  // ── 5. Start listening ───────────────────────────────────────────────────
  httpServer.listen(PORT, () => {
    logger.info(`Realtime server listening on port ${PORT} [${process.env['NODE_ENV'] ?? 'development'}]`);
  });

  // ── 6. Graceful shutdown ─────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    io.close(async () => {
      await closeRedis();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap();
