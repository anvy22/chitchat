import {
  mockMessages,
  mockActivities,
  mockStats,
  mockAssets,
  mockTeamMembers,
  mockUsers,
  mockTemplates,
} from "./mock-data";
import { sleep } from "@/lib/utils";
import { canvasService } from "./canvas/canvas-service";
import type { Space, Message, Activity, DashboardStats, Asset, TeamMember, User, Template } from "@/types";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await sleep(400);
  return mockStats;
}

export async function fetchSpaces(): Promise<Space[]> {
  await sleep(300);

  try {
    const canvases = await canvasService.listCanvases();
    return canvases.map(c => ({
      id: c.id,
      name: c.name || "Untitled Space",
      description: c.description || "A custom space created in the editor.",
      thumbnail: "🎨",
      memberCount: 0,
      activeUsers: [],
      maxCapacity: 50,
      type: "office" as const,
      lastActive: new Date(c.updatedAt).toISOString(),
      isLive: false,
    }));
  } catch (error) {
    console.error("Failed to load spaces", error);
    return [];
  }
}

export async function fetchSpaceById(id: string): Promise<Space> {
  await sleep(200);

  try {
    const canvas = await canvasService.loadCanvas(id);
    if (canvas) {
      return {
        id: canvas.id,
        name: canvas.name || "Untitled Space",
        description: canvas.description || "A custom space created in the editor.",
        thumbnail: "🎨",
        memberCount: 0,
        activeUsers: [],
        maxCapacity: 50,
        type: "office" as const,
        lastActive: new Date(canvas.updatedAt).toISOString(),
        isLive: false,
      };
    }
  } catch (error) {
    console.error("Failed to load space", error);
  }

  throw new Error(`Space "${id}" not found`);
}

export async function deleteSpace(id: string): Promise<void> {
  await canvasService.deleteCanvas(id);
}

export async function fetchMessages(spaceId: string): Promise<Message[]> {
  await sleep(350);
  void spaceId;
  return mockMessages;
}

export async function fetchActivities(): Promise<Activity[]> {
  await sleep(450);
  return mockActivities;
}

export async function fetchAssets(): Promise<Asset[]> {
  await sleep(300);
  return mockAssets;
}

export async function fetchTemplates(): Promise<Template[]> {
  await sleep(300);
  return mockTemplates;
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await sleep(500);
  return mockTeamMembers;
}

export async function fetchUsers(): Promise<User[]> {
  await sleep(250);
  return mockUsers;
}
