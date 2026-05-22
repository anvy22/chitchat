import type { AvatarConfig } from "@/types";
import { DEFAULT_AVATAR_CONFIG } from "@/types";

const STORAGE_KEY = "avatar_config";

/**
 * Avatar persistence service.
 * Currently backed by localStorage — swap the implementation for API calls
 * when the backend is ready.
 */
export const avatarService = {
  /**
   * Load the saved avatar config (or return defaults).
   */
  async loadConfig(): Promise<AvatarConfig> {
    if (typeof window === "undefined") return DEFAULT_AVATAR_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_AVATAR_CONFIG;
      const parsed = JSON.parse(raw) as Partial<AvatarConfig>;
      // Merge with defaults so new fields always have a value
      return { ...DEFAULT_AVATAR_CONFIG, ...parsed };
    } catch {
      return DEFAULT_AVATAR_CONFIG;
    }
  },

  /**
   * Save avatar config to storage.
   */
  async saveConfig(config: AvatarConfig): Promise<AvatarConfig> {
    if (typeof window === "undefined") return config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
  },

  /**
   * Reset to defaults.
   */
  async resetConfig(): Promise<AvatarConfig> {
    if (typeof window === "undefined") return DEFAULT_AVATAR_CONFIG;
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_AVATAR_CONFIG;
  },
};
