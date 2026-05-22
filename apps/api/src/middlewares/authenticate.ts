import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";
import { AppError } from "./errorHandler";
import { getRedisClient } from "@chitchat/db";

const REDIS_BLOCKLIST_PREFIX = "blocklist:";

// Extend Express Request globally so req.user is properly typed everywhere
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Token missing from Authorization header", 401);
  }

  try {
    const decoded = verifyAccessToken(token);

    // Check if token's jti is in the blocklist (from a previous logout)
    const redis = getRedisClient();
    const isBlocklisted = await redis.get(`${REDIS_BLOCKLIST_PREFIX}${decoded.jti}`);
    
    if (isBlocklisted) {
      throw new AppError("Session revoked", 401);
    }

    // Inject into request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Invalid or expired access token", 401);
  }
};
