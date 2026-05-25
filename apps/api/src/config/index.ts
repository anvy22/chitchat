
const parsePositiveInt = (raw: string | undefined, fallback: number, key: string) => {
  const value = Number.parseInt(raw ?? String(fallback), 10);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid ${key}: ${raw}`);
  }
  return value;
};

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required env var ${key} is not defined`);
  }
  return value;
}

const config = {
  app: {
    name: 'ChitChat API',
    version: '1.0.0',
    env: process.env['NODE_ENV'] ?? 'development',
    port: parsePositiveInt(process.env['PORT'], 4000, 'PORT'),
    logs: true,
  },

  server: {
    timeout: 30000,
    maxRequestSize: '10mb',
    corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  },

  database: {
    supabaseUrl: requiredEnv('SUPABASE_URL'),
    supabaseKey: requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    redisUrl: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  },

  jwt: {
    secret: requiredEnv('JWT_SECRET'),
    refreshSecret: requiredEnv('REFRESH_SECRET'),
    accessTtl: parsePositiveInt(process.env['JWT_ACCESS_TTL'], 900, 'JWT_ACCESS_TTL'),  // 15 min
    refreshTtl: parsePositiveInt(process.env['JWT_REFRESH_TTL'], 604800, 'JWT_REFRESH_TTL'), // 7 days
  },
};

export default config;