import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public data?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");

  if (err instanceof AppError) {
    return res.sendError(err.data ?? null, err.message, err.statusCode);
  }

  return res.sendError(
    process.env.NODE_ENV === "development" ? { stack: err.stack } : null,
    err.message || "Internal Server Error",
    500
  );
};
