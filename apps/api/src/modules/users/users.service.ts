import { getSupabaseClient, getRedisClient } from "@chitchat/db";
import { AppError } from "@/middlewares/errorHandler";
import { UserProfile, UpdateProfileDto } from "@chitchat/types";

const CACHE_TTL = 600; // 10 minutes

export const usersService = {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const redis = getRedisClient();
    const cacheKey = `user:${userId}:profile`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as UserProfile;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new AppError("User profile not found", 404);
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarConfig: data.avatar_config,
      photoUrl: data.photo_url,
      status: data.status as any, // UserStatus
      role: data.role as any, // UserRole
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(profile));

    return profile;
  },

  async updateUserProfile(userId: string, updates: UpdateProfileDto): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    const redis = getRedisClient();
    const cacheKey = `user:${userId}:profile`;

    // Build update object
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.avatarConfig !== undefined) dbUpdates.avatar_config = updates.avatarConfig;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    if (Object.keys(dbUpdates).length === 0) {
      throw new AppError("No fields provided for update", 400);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError("Failed to update profile", 500);
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarConfig: data.avatar_config,
      photoUrl: data.photo_url,
      status: data.status as any, // UserStatus
      role: data.role as any, // UserRole
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Update cache
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(profile));

    return profile;
  },

  async getUserProfileById(userId: string): Promise<UserProfile> {
    // This is essentially the same as getUserProfile but for any user ID
    return this.getUserProfile(userId);
  }
};