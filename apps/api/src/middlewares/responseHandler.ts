import { Request, NextFunction, Response as ExpressResponse } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

export const responseHandler = (req: Request, res: ExpressResponse, next: NextFunction): void => {

  res.sendSuccess = function <T>(data: T, message: string = "success", statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  };

  res.sendError = function <T>(data: T, message: string = "error", statusCode: number = 500) {
    const response: ApiResponse<T> = {
      success: false,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    
    return res.status(statusCode).json(response);
  };

  next();
};


declare global {
  namespace Express {
    interface Response {
      sendSuccess: <T>(data: T, message?: string, statusCode?: number) => void;
      sendError: <T>(data: T, message?: string, statusCode?: number) => void;
    }
  }
}