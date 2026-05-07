import { CanvasData } from "@/types";

const STORAGE_KEY = "chitchat_canvases";

// Helper to handle Next.js SSR hydration where localStorage is not defined
const getStorage = (): Storage | null => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

// Internal synchronous method to get all canvases
const getAllCanvasesSync = (): Record<string, CanvasData> => {
  const storage = getStorage();
  if (!storage) return {};
  
  const data = storage.getItem(STORAGE_KEY);
  if (!data) return {};
  
  try {
    return JSON.parse(data) as Record<string, CanvasData>;
  } catch (e) {
    console.error("Failed to parse canvas data from localStorage", e);
    return {};
  }
};

/**
 * Service to manage canvas persistence.
 * Currently uses localStorage, but the async API ensures a seamless migration
 * to a backend database like Supabase or Firebase in the future.
 */
export const canvasService = {
  /**
   * List all saved canvases.
   */
  async listCanvases(): Promise<CanvasData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const canvasesMap = getAllCanvasesSync();
        const canvasesArray = Object.values(canvasesMap).sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(canvasesArray);
      }, 300); // Simulate network latency
    });
  },

  /**
   * Load a specific canvas by ID.
   */
  async loadCanvas(id: string): Promise<CanvasData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const canvasesMap = getAllCanvasesSync();
        resolve(canvasesMap[id] || null);
      }, 200); // Simulate network latency
    });
  },

  /**
   * Save a canvas (create or update).
   */
  async saveCanvas(data: CanvasData): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storage = getStorage();
        if (!storage) {
          reject(new Error("Storage is not available."));
          return;
        }

        const canvasesMap = getAllCanvasesSync();
        canvasesMap[data.id] = {
          ...data,
          updatedAt: Date.now(),
        };

        try {
          storage.setItem(STORAGE_KEY, JSON.stringify(canvasesMap));
          resolve();
        } catch (e) {
          reject(new Error("Failed to save canvas to storage."));
        }
      }, 500); // Simulate network latency
    });
  },

  /**
   * Delete a canvas by ID.
   */
  async deleteCanvas(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storage = getStorage();
        if (!storage) {
          reject(new Error("Storage is not available."));
          return;
        }

        const canvasesMap = getAllCanvasesSync();
        if (canvasesMap[id]) {
          delete canvasesMap[id];
          storage.setItem(STORAGE_KEY, JSON.stringify(canvasesMap));
        }
        resolve();
      }, 300); // Simulate network latency
    });
  }
};
