import 'dotenv/config';
import 'express-async-errors';
import { getSupabaseClient, getRedisClient, closeRedis } from '@chitchat/db';
import { logger } from '@/utils/logger';
import app from '@/app';
import config from '@/config';

async function bootstrap() {
  try {
    //supabase 
    const sb = getSupabaseClient();
    const { error } = await sb.rpc('version').single();
    if (error && error.code !== 'PGRST202') {
      throw new Error(`Supabase: ${error.message}`);
    }
    logger.info('✓ Supabase connected');

    // redis
    const redis = getRedisClient();
    await redis.ping();
    logger.info('✓ Redis connected');
  } catch (err) {
    logger.error({ err }, '✗ DB connection failed — aborting startup');
    process.exit(1);
  }

  const server = app.listen(config.app.port, () => {
    logger.info(`API server listening on port ${config.app.port} [${config.app.env}]`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${config.app.port} is already in use. Run: fuser -k ${config.app.port}/tcp`);
    } else {
      logger.error({ err }, 'Server error');
    }
    process.exit(1);
  });


  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await closeRedis();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap();
