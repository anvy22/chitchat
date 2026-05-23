const config = {
  app: {
    name: 'ChitChat API',
    version: '1.0.0',
    env: process.env['NODE_ENV'] ?? 'development',
    port: parseInt(process.env['PORT'] ?? '4000', 10),
    logs: true,
  },

  server: {
    timeout: 30000,
    maxRequestSize: '10mb',
    corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  },

  database: {
    supabaseUrl: process.env['SUPABASE_URL'],
    supabaseKey: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    redisUrl: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env['JWT_SECRET'] ?? '',
    refreshSecret: process.env['REFRESH_SECRET'] ?? '',
    accessTtl: parseInt(process.env['JWT_ACCESS_TTL'] ?? '900', 10),   // 15 min
    refreshTtl: parseInt(process.env['JWT_REFRESH_TTL'] ?? '604800', 10), // 7 days
  },
};

export default config;