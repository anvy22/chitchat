import { Request, Response } from "express";
import { authService } from "./auth.service";
import { oauthCallbackSchema } from "./auth.schema";
import config from "@/config";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.app.env === "production",
  sameSite: "lax" as const,
  maxAge: config.jwt.refreshTtl * 1000,
};

export const authController = {
  async oauthCallback(req: Request, res: Response) {

    const { token } = oauthCallbackSchema.parse(req.body);
    
    const { accessToken, refreshToken, user } = await authService.oauthCallback(token);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.sendSuccess({ accessToken, user }, "Authentication successful");
  },

  async refresh(req: Request, res: Response) {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.sendError(null, "No refresh token provided", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    res.sendSuccess({ accessToken }, "Token refreshed");
  },

  async logout(req: Request, res: Response) {
    const user = req.user;
    
    if (user?.sub && user?.jti) {
      await authService.logout(user.sub, user.jti);
    }

    res.clearCookie("refreshToken");
    res.sendSuccess(null, "Logged out successfully");
  }
};
