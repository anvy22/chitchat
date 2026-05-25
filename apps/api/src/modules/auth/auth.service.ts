import { getSupabaseClient, getRedisClient } from "@chitchat/db";
import { signTokens, verifyRefreshToken } from "@/lib/jwt";
import { AppError } from "@/middlewares/errorHandler";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import config from "@/config";

const REDIS_REFRESH_PREFIX = "refresh:";
const REDIS_BLOCKLIST_PREFIX = "blocklist:";

export const authService = {
  async oauthCallback(token: string) {
    const supabase = getSupabaseClient();
    const redis = getRedisClient();

    // Validate the Supabase access token sent from the frontend after PKCE exchange
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new AppError(userError?.message || "Invalid Supabase token", 401);
    }

    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new AppError("Profile not found after signup. Ensure DB trigger ran.", 500);
    }

    // 3. Get or create default workspace
    const { data: workspaceMembers } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .limit(1);

    let workspaceId: string;

    if (!workspaceMembers || workspaceMembers.length === 0) {
    
      const { data: newWs, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          name: "My Workspace",
          slug: `ws-${uuidv4().substring(0, 8)}`,
          owner_id: userId,
        })
        .select("id")
        .single();

      if (wsError || !newWs) throw new AppError("Failed to create workspace", 500);
      
      workspaceId = newWs.id;

      // Add as owner
      const {error:memberError} = await supabase.from("workspace_members").insert({
        workspace_id: workspaceId,
        user_id: userId,
        role: "owner",
      });
      
      if (memberError) {
        throw new AppError("Failed to create workspace membership", 500);
      }

    } else {
      const firstMember = workspaceMembers[0];
      if (!firstMember?.workspace_id) {
        throw new AppError("Workspace ID missing", 500);
      }
      workspaceId = firstMember.workspace_id;
    }

    // 4. Generate JWT tokens
    const { accessToken, refreshToken, jti } = signTokens({
      sub: profile.id,
      email: profile.email,
      role: profile.role as 'admin' | 'member' | 'guest',
      workspaceId,
    });

    // 5. Store hashed refresh token in Redis (TTL = 7 days)
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await redis.setex(
      `${REDIS_REFRESH_PREFIX}${userId}`,
      config.jwt.refreshTtl,
      hashedRefresh
    );

    return { accessToken, refreshToken, user: profile };
  },

  async refresh(refreshToken: string) {
    const redis = getRedisClient();

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const userId = decoded.sub;

    // Verify against Redis stored hash
    const storedHash = await redis.get(`${REDIS_REFRESH_PREFIX}${userId}`);
    if (!storedHash) {
      throw new AppError("Session expired. Please log in again.", 401);
    }

    const isValid = await bcrypt.compare(refreshToken, storedHash);
    if (!isValid) {
      // Token reuse detected or invalid token. Security measure: delete session.
      await redis.del(`${REDIS_REFRESH_PREFIX}${userId}`);
      throw new AppError("Invalid refresh token", 401);
    }

    // Issue new tokens
    const { accessToken, refreshToken: newRefreshToken, jti: newJti } = signTokens({
      sub: userId,
      email: decoded.email,
      role: decoded.role,
      workspaceId: decoded.workspaceId,
    });

    // Update Redis
    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    await redis.setex(
      `${REDIS_REFRESH_PREFIX}${userId}`,
      config.jwt.refreshTtl,
      hashedRefresh
    );

    // Blocklist the old JTI (Access token might still be alive for a few mins)
    await redis.setex(`${REDIS_BLOCKLIST_PREFIX}${decoded.jti}`, config.jwt.accessTtl, 'revoked');

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(userId: string, jti: string) {
    const redis = getRedisClient();

    // Remove refresh token from Redis
    await redis.del(`${REDIS_REFRESH_PREFIX}${userId}`);

    // Add current access token JTI to blocklist (so it can't be used for the rest of its 15m life)
    if (jti) {
      await redis.setex(`${REDIS_BLOCKLIST_PREFIX}${jti}`, config.jwt.accessTtl, 'revoked');
    }
  }
};
