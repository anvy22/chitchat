import { User, Bell, Shield, Palette, Volume2, Monitor, MousePointer2, Hand, Square, Circle, Type, Grid3x3 } from "lucide-react";

export const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "audio", label: "Audio & Video", icon: Volume2 },
  { id: "display", label: "Display", icon: Monitor },
];

export const EDITOR_TOOLS = [
  { icon: MousePointer2, label: "Select" },
  { icon: Hand, label: "Pan" },
  { icon: Square, label: "Rectangle" },
  { icon: Circle, label: "Ellipse" },
  { icon: Type, label: "Text" },
  { icon: Grid3x3, label: "Grid" },
];

export const BG_OPTIONS = [
  { value: "dark-tiles", label: "Dark Tiles" },
  { value: "wood-floor", label: "Wood Floor" },
  { value: "concrete", label: "Concrete" },
  { value: "blue-carpet", label: "Blue Carpet" },
  { value: "grass", label: "Grass" },
  { value: "sand", label: "Sand" },
  { value: "marble", label: "Marble" },
] as const;

export const EDITOR_CATEGORIES = ["all", "furniture", "decoration", "zone", "interactive"];
export const GRID_SIZE = 40;

export const SPACE_CARD_THEMES = [
  { color: "#6D3BD7", name: "purple" },
  { color: "#0566D9", name: "blue" },
  { color: "#00A572", name: "emerald" },
  { color: "#F59E0B", name: "amber" },
  { color: "#EC4899", name: "pink" },
  { color: "#14B8A6", name: "teal" },
];
