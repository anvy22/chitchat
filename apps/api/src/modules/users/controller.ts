import { Request, Response } from "express";
import { usersService } from "./users.service";
import { AppError } from "@/middlewares/errorHandler";
import { UpdateProfileDto } from "@chitchat/types";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatarConfig: z.record(z.any()).optional(),
  photoUrl: z.string().url().optional(),
  status: z.enum(['online', 'away', 'busy', 'offline']).optional(),
});

export const userController = {
  async getUser(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const profile = await usersService.getUserProfile(userId);
    res.sendSuccess(profile, "User profile retrieved successfully");
  },

  async updateUser(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid input", 400, parsed.error.format());
    }

    const updates: UpdateProfileDto = {
      name: parsed.data.name,
      avatarConfig: parsed.data.avatarConfig,
      photoUrl: parsed.data.photoUrl,
      status: parsed.data.status,
    };

    const profile = await usersService.updateUserProfile(userId, updates);
    res.sendSuccess(profile, "User profile updated successfully");
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User ID is required", 400);
    }

    const profile = await usersService.getUserProfileById(id);
    res.sendSuccess(profile, "User profile retrieved successfully");
  }
};