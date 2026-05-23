"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import {
  fetchDashboardStats,
  fetchSpaces,
  fetchSpaceById,
  fetchMessages,
  fetchActivities,
  fetchAssets,
  fetchTeamMembers,
  fetchTemplates,
  deleteSpace,
} from "@/services/api";
import { canvasService } from "@/services/canvas/canvas-service";
import { avatarService } from "@/services/avatar-service";
import { DEFAULT_AVATAR_CONFIG } from "@/types";
import type { AvatarConfig } from "@/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
}

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });
}

export function useDeleteSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSpace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: ["space", id],
    queryFn: () => fetchSpaceById(id),
    enabled: !!id,
  });
}

export function useCanvasData(id: string) {
  return useQuery({
    queryKey: ["canvas", id],
    queryFn: () => canvasService.loadCanvas(id),
    enabled: !!id,
  });
}

export function useMessages(spaceId: string) {
  return useQuery({
    queryKey: ["messages", spaceId],
    queryFn: () => fetchMessages(spaceId),
    enabled: !!spaceId,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });
}

export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });
}

export function useAuthUser() {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["authUser", authUser?.id, authUser?.email],
    queryFn: async () => {
      if (typeof window === "undefined") return { id: "u1", name: "Unknown", avatar: "DC" };
      const saved = localStorage.getItem("user_profile");
      const profile = saved ? JSON.parse(saved) : {};
      
      const email = authUser?.email || profile.email || "";
      const name = profile.name || authUser?.email?.split("@")[0] || "Unknown";
      
      return { 
        id: authUser?.id || "u1", 
        name: name, 
        email: email, 
        avatar: name.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "DC", 
        role: (authUser?.role || "admin") as any, 
        status: "online" as const, 
        department: "Engineering", 
        spacesCount: 3 
      };
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData: { name: string; email?: string; bio?: string }) => {
      localStorage.setItem("user_profile", JSON.stringify(newData));
      return newData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}

// ─── Avatar Config ──────────────────────────────────────────────────

export function useAvatarConfig() {
  return useQuery({
    queryKey: ["avatarConfig"],
    queryFn: () => avatarService.loadConfig(),
  });
}

export function useUpdateAvatarConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: AvatarConfig) => avatarService.saveConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatarConfig"] });
    },
  });
}

export function useResetAvatarConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => avatarService.resetConfig(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatarConfig"] });
    },
  });
}
