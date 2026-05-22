import Redis, { type RedisOptions } from 'ioredis';

let _client: Redis | null = null;

/**
 * Returns a singleton ioredis client.
 *
 * Call once at service startup:
 *   import { getRedisClient } from '@chitchat/db';
 *   const redis = getRedisClient();
 *
 * The client will auto-reconnect on connection loss.
 * Caller is responsible for handling 'error' events if needed.
 */
export function getRedisClient(options?: RedisOptions): Redis {
  if (_client) return _client;

  const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

  _client = new Redis(url, {
    retryStrategy: (times) => Math.min(times * 200, 3000),
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    ...options,
  });

  _client.on('connect', () => {
    console.log('Connected to Redis');
  });

  _client.on('error', (err: Error) => {
    console.error('Redis error:', err.message);
  });

  return _client;
}

/**
 * Creates a **duplicate** connection from the singleton client.
 * Required for SUBSCRIBE commands — Redis protocol disallows mixing
 * pub/sub and regular commands on the same connection.
 *
 * Usage in apps/realtime:
 *   const sub = createRedisDuplicate();
 *   sub.subscribe('channel', ...);
 */
export function createRedisDuplicate(): Redis {
  return getRedisClient().duplicate();
}


export async function closeRedis(): Promise<void> {
  if (_client) {
    await _client.quit();
    _client = null;
  }
}
