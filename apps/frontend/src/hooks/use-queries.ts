"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      return { id: "u1", name: "Dale Cooper", email: "dale@orbithq.com", avatar: "DC", role: "admin" as const, status: "online" as const, department: "Engineering", spacesCount: 3 };
    },
  });
} 
