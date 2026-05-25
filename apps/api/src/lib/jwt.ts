import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from 'uuid';
import { logger } from "@/utils/logger";
import config from "@/config";

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  workspaceId: string;
  jti: string;
  iat?: number;
  exp?: number;
}

if (!config.jwt.secret || !config.jwt.refreshSecret) {
  logger.error("JWT_SECRET or REFRESH_SECRET not defined in environment");
  process.exit(1);
}

export const signTokens = (payload: Omit<JwtPayload, 'jti' | 'iat' | 'exp'>) => {

  const jti = uuidv7();

  const tokenPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
    ...payload,
    jti,
  };

  const accessToken = jwt.sign(tokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.accessTtl,
  });

  const refreshToken = jwt.sign(tokenPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshTtl,
  });

  return { accessToken, refreshToken, jti };
};


export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    logger.error(`Access token verification failed: ${error instanceof Error ? error.message : error}`);
    return null;
  }
};


export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  } catch (error) {
    logger.error(`Refresh token verification failed: ${error instanceof Error ? error.message : error}`);
    return null;
  }
};
