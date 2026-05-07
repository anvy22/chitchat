import { User, Space, Message, Activity, DashboardStats, Asset, TeamMember, Template } from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Dale Cooper",
  email: "dale@orbithq.com",
  avatar: "DC",
  status: "online",
  role: "admin",
};

export const mockUsers: User[] = [
  currentUser,
  { id: "u2", name: "Audrey Horne", email: "audrey@orbithq.com", avatar: "AH", status: "online", role: "member" },
  { id: "u3", name: "Bobby Briggs", email: "bobby@orbithq.com", avatar: "BB", status: "away", role: "member" },
  { id: "u4", name: "Laura Palmer", email: "laura@orbithq.com", avatar: "LP", status: "online", role: "member" },
  { id: "u5", name: "James Hurley", email: "james@orbithq.com", avatar: "JH", status: "busy", role: "member" },
  { id: "u6", name: "Donna Hayward", email: "donna@orbithq.com", avatar: "DH", status: "offline", role: "guest" },
  { id: "u7", name: "Ed Hurley", email: "ed@orbithq.com", avatar: "EH", status: "online", role: "member" },
  { id: "u8", name: "Norma Jennings", email: "norma@orbithq.com", avatar: "NJ", status: "away", role: "member" },
];

export const mockSpaces: Space[] = [
  {
    id: "s1",
    name: "Engineering Hub",
    description: "Main engineering workspace for daily standups and pair programming sessions.",
    thumbnail: "🏗️",
    memberCount: 24,
    activeUsers: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[6]],
    maxCapacity: 50,
    type: "office",
    lastActive: new Date(Date.now() - 120000).toISOString(),
    isLive: true,
  },
  {
    id: "s2",
    name: "Design Studio",
    description: "Creative space for design reviews and brainstorming sessions.",
    thumbnail: "🎨",
    memberCount: 12,
    activeUsers: [mockUsers[1], mockUsers[4]],
    maxCapacity: 30,
    type: "meeting",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    isLive: true,
  },
  {
    id: "s3",
    name: "Coffee Lounge",
    description: "Casual hangout zone for watercooler conversations.",
    thumbnail: "☕",
    memberCount: 8,
    activeUsers: [mockUsers[2]],
    maxCapacity: 20,
    type: "lounge",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    isLive: false,
  },
  {
    id: "s4",
    name: "Q3 Marketing Launch",
    description: "War room for the Q3 campaign planning and execution.",
    thumbnail: "🚀",
    memberCount: 16,
    activeUsers: [mockUsers[3], mockUsers[5], mockUsers[7]],
    maxCapacity: 40,
    type: "meeting",
    lastActive: new Date(Date.now() - 300000).toISOString(),
    isLive: true,
  },
  {
    id: "s5",
    name: "All Hands Arena",
    description: "Company-wide event space for town halls and celebrations.",
    thumbnail: "🎤",
    memberCount: 64,
    activeUsers: [],
    maxCapacity: 200,
    type: "event",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    isLive: false,
  },
  {
    id: "s6",
    name: "Product Redesign",
    description: "Focused workspace for the v3 product redesign initiative.",
    thumbnail: "✏️",
    memberCount: 10,
    activeUsers: [mockUsers[0], mockUsers[6]],
    maxCapacity: 25,
    type: "office",
    lastActive: new Date(Date.now() - 600000).toISOString(),
    isLive: true,
  },
];

export const mockMessages: Message[] = [
  { id: "m1", userId: "u2", userName: "Audrey Horne", userAvatar: "AH", content: "Has anyone reviewed the latest wireframes?", timestamp: new Date(Date.now() - 120000).toISOString(), type: "text" },
  { id: "m2", userId: "u1", userName: "Dale Cooper", userAvatar: "DC", content: "Yes! The new dashboard layout looks fantastic. Great work on the spacing.", timestamp: new Date(Date.now() - 60000).toISOString(), type: "text" },
  { id: "m3", userId: "u4", userName: "Laura Palmer", userAvatar: "LP", content: "I'll push the updated components to staging in 10 minutes.", timestamp: new Date(Date.now() - 30000).toISOString(), type: "text" },
  { id: "m4", userId: "u3", userName: "Bobby Briggs", userAvatar: "BB", content: "🎉 The deployment pipeline is finally green!", timestamp: new Date(Date.now() - 15000).toISOString(), type: "text" },
  { id: "m5", userId: "u7", userName: "Ed Hurley", userAvatar: "EH", content: "Meeting starts in 5. Everyone ready?", timestamp: new Date(Date.now() - 5000).toISOString(), type: "text" },
];

export const mockActivities: Activity[] = [
  { id: "a1", userId: "u2", userName: "Audrey Horne", userAvatar: "AH", action: "joined", target: "Engineering Hub", timestamp: new Date(Date.now() - 60000).toISOString(), type: "join" },
  { id: "a2", userId: "u4", userName: "Laura Palmer", userAvatar: "LP", action: "created", target: "Sprint Review Room", timestamp: new Date(Date.now() - 300000).toISOString(), type: "create" },
  { id: "a3", userId: "u3", userName: "Bobby Briggs", userAvatar: "BB", action: "edited", target: "Design Studio layout", timestamp: new Date(Date.now() - 900000).toISOString(), type: "edit" },
  { id: "a4", userId: "u5", userName: "James Hurley", userAvatar: "JH", action: "sent a message in", target: "Coffee Lounge", timestamp: new Date(Date.now() - 1800000).toISOString(), type: "message" },
  { id: "a5", userId: "u7", userName: "Ed Hurley", userAvatar: "EH", action: "joined", target: "Q3 Marketing Launch", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "join" },
  { id: "a6", userId: "u8", userName: "Norma Jennings", userAvatar: "NJ", action: "created", target: "Team Retro Space", timestamp: new Date(Date.now() - 7200000).toISOString(), type: "create" },
];

export const mockStats: DashboardStats = {
  activeSpaces: 4,
  onlineMembers: 12,
  totalSpaces: 6,
  messagestoday: 284,
};

export const mockAssets: Asset[] = [
  { id: "a1", name: "Desk", category: "furniture", icon: "🪑", color: "#8B5CF6", width: 2, height: 1 },
  { id: "a2", name: "Meeting Table", category: "furniture", icon: "🗂️", color: "#3B82F6", width: 3, height: 2 },
  { id: "a3", name: "Whiteboard", category: "interactive", icon: "📋", color: "#10B981", width: 2, height: 1 },
  { id: "a4", name: "Plant", category: "decoration", icon: "🌿", color: "#22C55E", width: 1, height: 1 },
  { id: "a5", name: "Couch", category: "furniture", icon: "🛋️", color: "#F59E0B", width: 2, height: 1, defaultActions: [{ type: 'SIT', label: 'Sit Down', icon: '🪑' }] },
  { id: "a6", name: "Projector Screen", category: "interactive", icon: "📺", color: "#EF4444", width: 3, height: 1 },
  { id: "a7", name: "Private Zone", category: "zone", icon: "🔒", color: "#6366F1", width: 4, height: 4 },
  { id: "a8", name: "Break Area", category: "zone", icon: "☕", color: "#EC4899", width: 4, height: 4 },
  { id: "a9", name: "Bookshelf", category: "decoration", icon: "📚", color: "#8B5CF6", width: 2, height: 1 },
  { id: "a10", name: "Speaker", category: "interactive", icon: "🔊", color: "#3B82F6", width: 1, height: 1 },
  { id: "a11", name: "Firepit", category: "interactive", icon: "🔥", color: "#EF4444", width: 2, height: 2 },
  { id: "a12", name: "Zen Garden", category: "decoration", icon: "🪨", color: "#A8A29E", width: 3, height: 3 },
  { id: "a13", name: "Bar Counter", category: "furniture", icon: "🍸", color: "#A8A29E", width: 4, height: 1 },
  { id: "a14", name: "Round Table", category: "furniture", icon: "🍽️", color: "#D97706", width: 2, height: 2 },
  { id: "a15", name: "Office Desk", category: "furniture", icon: "💻", color: "#475569", width: 2, height: 1 },
  { id: "a16", name: "Office Chair", category: "furniture", icon: "💺", color: "#334155", width: 1, height: 1, defaultActions: [{ type: 'SIT', label: 'Sit Down', icon: '💺' }] },
  { id: "a17", name: "Filing Cabinet", category: "furniture", icon: "🗄️", color: "#94A3B8", width: 1, height: 1 },
  { id: "a18", name: "Water Cooler", category: "interactive", icon: "💧", color: "#38BDF8", width: 1, height: 1 },
  { id: "a19", name: "Cubicle Wall", category: "zone", icon: "🧱", color: "#CBD5E1", width: 3, height: 1 },
  { id: "a20", name: "Student Desk", category: "furniture", icon: "✏️", color: "#B45309", width: 1, height: 1 },
  { id: "a21", name: "Teacher Desk", category: "furniture", icon: "🍎", color: "#78350F", width: 3, height: 1 },
  { id: "a22", name: "Chalkboard", category: "interactive", icon: "📉", color: "#064E3B", width: 4, height: 1 },
  { id: "a23", name: "Server Rack", category: "interactive", icon: "🗄️", color: "#1E293B", width: 1, height: 2 },
  { id: "a24", name: "Tree", category: "decoration", icon: "🌳", color: "#064E3B", width: 2, height: 2 },
  { id: "a25", name: "Purple Plant", category: "decoration", icon: "🪴", color: "#8B5CF6", width: 1, height: 1 },
  { id: "a26", name: "Wooden Deck", category: "zone", icon: "🪵", color: "#8B5A2B", width: 10, height: 14 },
  { id: "a27", name: "Patterned Carpet", category: "zone", icon: "🖧", color: "#4C1D95", width: 5, height: 5 },
  { id: "a28", name: "Platform", category: "zone", icon: "🏢", color: "#334155", width: 8, height: 8 },
  { id: "a29", name: "Purple Couch", category: "furniture", icon: "🛋️", color: "#7C3AED", width: 2, height: 1, defaultActions: [{ type: 'SIT', label: 'Sit Down', icon: '🛋️' }] },
  { id: "a30", name: "Oak Tree", category: "decoration", icon: "🌳", color: "#064E3B", width: 2, height: 2 },
  { id: "a31", name: "Pine Tree", category: "decoration", icon: "🌲", color: "#064E3B", width: 2, height: 2 },
  { id: "a32", name: "Cherry Blossom", category: "decoration", icon: "🌸", color: "#F472B6", width: 2, height: 2 },
  { id: "a33", name: "Palm Tree", category: "decoration", icon: "🌴", color: "#10B981", width: 2, height: 2 },
  { id: "a34", name: "Grass Patch", category: "zone", icon: "🟩", color: "#22C55E", width: 5, height: 5 },
  { id: "a35", name: "Sand Pit", category: "zone", icon: "🟨", color: "#FDE047", width: 4, height: 4 },
  { id: "a36", name: "Marble Floor", category: "zone", icon: "⬜", color: "#E2E8F0", width: 6, height: 6 },
  { id: "a37", name: "Door", category: "interactive", icon: "🚪", color: "#92400E", width: 1, height: 2, defaultActions: [{ type: 'TELEPORT', label: 'Enter Room', icon: '🚪' }] },
  { id: "a38", name: "Pool", category: "zone", icon: "🏊", color: "#0EA5E9", width: 4, height: 4, defaultActions: [{ type: 'SWIM', label: 'Swim', icon: '🏊' }] },
];

export const mockTemplates: Template[] = [
  {
    id: "t1",
    title: "Cozy Lounge",
    description: "A comfortable layout around a firepit",
    iconName: "Users",
    color: "#6D3BD7",
    bgTheme: "wood-floor",
    elements: [
      // Central Firepit area
      { id: "e1", assetId: "a11", x: 10, y: 8 },
      { id: "e2", assetId: "a5", x: 10, y: 6, rotation: 0 },
      { id: "e3", assetId: "a5", x: 10, y: 11, rotation: 180 },
      { id: "e4", assetId: "a5", x: 7, y: 8, rotation: 270 },
      { id: "e5", assetId: "a5", x: 13, y: 8, rotation: 90 },
      { id: "e6", assetId: "a4", x: 7, y: 6 },
      { id: "e7", assetId: "a4", x: 14, y: 11 },
      
      // Bar area (Top right)
      { id: "e8", assetId: "a13", x: 15, y: 2 },
      { id: "e9", assetId: "a10", x: 19, y: 1 },
      { id: "e10", assetId: "a14", x: 16, y: 5 }, // Round table
      { id: "e11", assetId: "a14", x: 19, y: 5 }, // Round table
      
      // Reading corner (Bottom left)
      { id: "e12", assetId: "a9", x: 2, y: 12 },
      { id: "e13", assetId: "a9", x: 4, y: 12 },
      { id: "e14", assetId: "a5", x: 3, y: 10, rotation: 180 },
      { id: "e15", assetId: "a12", x: 1, y: 14 }, // Zen garden

      // Extra plants
      { id: "e16", assetId: "a4", x: 1, y: 1 },
      { id: "e17", assetId: "a4", x: 19, y: 14 },
      // Added for congestion
      { id: "e18", assetId: "a30", x: 1, y: 4 }, // Oak tree
      { id: "e19", assetId: "a31", x: 4, y: 1 }, // Pine tree
      { id: "e20", assetId: "a4", x: 2, y: 14 },
      { id: "e21", assetId: "a4", x: 5, y: 14 },
      { id: "e22", assetId: "a25", x: 14, y: 1 },
      { id: "e23", assetId: "a25", x: 13, y: 1 },
      { id: "e24", assetId: "a25", x: 18, y: 14 },
      { id: "e25", assetId: "a1", x: 16, y: 8 },
      { id: "e26", assetId: "a1", x: 18, y: 8 },
      { id: "e27", assetId: "a16", x: 16, y: 9 },
      { id: "e28", assetId: "a16", x: 18, y: 9 },
    ]
  },
  {
    id: "t2",
    title: "All Hands Arena",
    description: "Large meeting space",
    iconName: "MonitorSmartphone",
    color: "#0566D9",
    bgTheme: "dark-tiles",
    elements: [
      // Stage
      { id: "a_1", assetId: "a6", x: 9, y: 1 }, // Projector
      { id: "a_2", assetId: "a3", x: 6, y: 1 }, // Whiteboard
      { id: "a_3", assetId: "a3", x: 13, y: 1 }, // Whiteboard
      { id: "a_4", assetId: "a10", x: 5, y: 2 }, // Speaker
      { id: "a_5", assetId: "a10", x: 15, y: 2 }, // Speaker
      { id: "a_6", assetId: "a2", x: 9, y: 3 }, // Meeting table

      // Row 1
      { id: "a_7", assetId: "a1", x: 5, y: 7 },
      { id: "a_8", assetId: "a1", x: 8, y: 7 },
      { id: "a_9", assetId: "a1", x: 11, y: 7 },
      { id: "a_10", assetId: "a1", x: 14, y: 7 },

      // Row 2
      { id: "a_11", assetId: "a1", x: 5, y: 9 },
      { id: "a_12", assetId: "a1", x: 8, y: 9 },
      { id: "a_13", assetId: "a1", x: 11, y: 9 },
      { id: "a_14", assetId: "a1", x: 14, y: 9 },

      // Row 3
      { id: "a_15", assetId: "a1", x: 5, y: 11 },
      { id: "a_16", assetId: "a1", x: 8, y: 11 },
      { id: "a_17", assetId: "a1", x: 11, y: 11 },
      { id: "a_18", assetId: "a1", x: 14, y: 11 },

      // Break Area (back)
      { id: "a_19", assetId: "a8", x: 1, y: 12 },
      { id: "a_20", assetId: "a18", x: 2, y: 13 },
      { id: "a_21", assetId: "a5", x: 1, y: 14 },
      
      // Plants
      { id: "a_22", assetId: "a4", x: 2, y: 1 },
      { id: "a_23", assetId: "a4", x: 18, y: 1 },
    ]
  },
  {
    id: "t3",
    title: "Open Office",
    description: "Modern startup office floor plan",
    iconName: "MonitorSmartphone",
    color: "#475569",
    bgTheme: "concrete",
    elements: [
      // Pod 1
      { id: "o_1", assetId: "a19", x: 2, y: 2 }, // Wall
      { id: "o_2", assetId: "a15", x: 2, y: 3 }, // Desk
      { id: "o_3", assetId: "a16", x: 2, y: 4 }, // Chair
      { id: "o_4", assetId: "a19", x: 5, y: 2 }, // Wall
      { id: "o_5", assetId: "a15", x: 5, y: 3 }, // Desk
      { id: "o_6", assetId: "a16", x: 5, y: 4 }, // Chair
      
      // Pod 2
      { id: "o_7", assetId: "a19", x: 2, y: 6 }, // Wall
      { id: "o_8", assetId: "a15", x: 2, y: 7 }, // Desk
      { id: "o_9", assetId: "a16", x: 2, y: 8 }, // Chair
      { id: "o_10", assetId: "a19", x: 5, y: 6 }, // Wall
      { id: "o_11", assetId: "a15", x: 5, y: 7 }, // Desk
      { id: "o_12", assetId: "a16", x: 5, y: 8 }, // Chair

      // Private Meeting Room
      { id: "o_13", assetId: "a7", x: 12, y: 1 },
      { id: "o_14", assetId: "a2", x: 12, y: 2 }, // Meeting table
      { id: "o_15", assetId: "a16", x: 12, y: 1 }, // Chair
      { id: "o_16", assetId: "a16", x: 14, y: 1 }, // Chair
      { id: "o_17", assetId: "a3", x: 12, y: 4 }, // Whiteboard
      
      // Server Room
      { id: "o_18", assetId: "a23", x: 18, y: 1 },
      { id: "o_19", assetId: "a23", x: 19, y: 1 },
      { id: "o_20", assetId: "a23", x: 18, y: 4 },
      { id: "o_21", assetId: "a23", x: 19, y: 4 },

      // Breakout area
      { id: "o_22", assetId: "a5", x: 12, y: 10 },
      { id: "o_23", assetId: "a14", x: 14, y: 10 },
      { id: "o_24", assetId: "a18", x: 16, y: 10 }, // Water Cooler
      { id: "o_25", assetId: "a17", x: 10, y: 10 }, // Filing Cabinet
      { id: "o_26", assetId: "a4", x: 1, y: 1 }, // Plant
      { id: "o_27", assetId: "a4", x: 10, y: 1 }, // Plant
    ]
  },
  {
    id: "t4",
    title: "Lecture Hall",
    description: "Classroom for large presentations",
    iconName: "BookOpen",
    color: "#B45309",
    bgTheme: "blue-carpet",
    elements: [
      // Front
      { id: "c_1", assetId: "a22", x: 6, y: 1 }, // Chalkboard 1
      { id: "c_2", assetId: "a22", x: 10, y: 1 }, // Chalkboard 2
      { id: "c_3", assetId: "a21", x: 8, y: 3 }, // Teacher Desk
      { id: "c_4", assetId: "a16", x: 9, y: 4 }, // Teacher Chair
      { id: "c_5", assetId: "a10", x: 4, y: 2 }, // Speaker
      { id: "c_6", assetId: "a10", x: 15, y: 2 }, // Speaker

      // Student Desks (Row 1)
      { id: "c_7", assetId: "a20", x: 4, y: 6 },
      { id: "c_8", assetId: "a20", x: 6, y: 6 },
      { id: "c_9", assetId: "a20", x: 8, y: 6 },
      { id: "c_10", assetId: "a20", x: 10, y: 6 },
      { id: "c_11", assetId: "a20", x: 12, y: 6 },
      { id: "c_12", assetId: "a20", x: 14, y: 6 },

      // Student Desks (Row 2)
      { id: "c_13", assetId: "a20", x: 4, y: 8 },
      { id: "c_14", assetId: "a20", x: 6, y: 8 },
      { id: "c_15", assetId: "a20", x: 8, y: 8 },
      { id: "c_16", assetId: "a20", x: 10, y: 8 },
      { id: "c_17", assetId: "a20", x: 12, y: 8 },
      { id: "c_18", assetId: "a20", x: 14, y: 8 },

      // Student Desks (Row 3)
      { id: "c_19", assetId: "a20", x: 4, y: 10 },
      { id: "c_20", assetId: "a20", x: 6, y: 10 },
      { id: "c_21", assetId: "a20", x: 8, y: 10 },
      { id: "c_22", assetId: "a20", x: 10, y: 10 },
      { id: "c_23", assetId: "a20", x: 12, y: 10 },
      { id: "c_24", assetId: "a20", x: 14, y: 10 },

      // Student Desks (Row 4)
      { id: "c_25", assetId: "a20", x: 4, y: 12 },
      { id: "c_26", assetId: "a20", x: 6, y: 12 },
      { id: "c_27", assetId: "a20", x: 8, y: 12 },
      { id: "c_28", assetId: "a20", x: 10, y: 12 },
      { id: "c_29", assetId: "a20", x: 12, y: 12 },
      { id: "c_30", assetId: "a20", x: 14, y: 12 },

      // Decoration
      { id: "c_31", assetId: "a9", x: 1, y: 5 }, // Bookshelf
      { id: "c_32", assetId: "a9", x: 1, y: 7 }, // Bookshelf
      { id: "c_33", assetId: "a17", x: 2, y: 1 }, // Filing Cabinet
      { id: "c_34", assetId: "a18", x: 18, y: 12 }, // Water cooler
      { id: "c_35", assetId: "a4", x: 18, y: 1 }, // Plant
      { id: "c_36", assetId: "a4", x: 1, y: 12 }, // Plant
    ]
  },
  {
    id: "t5",
    title: "Gather Lounge",
    description: "Recreation of a classic top-down social space",
    iconName: "Users",
    color: "#10B981",
    bgTheme: "dark-tiles",
    elements: [
      // Base zones
      { id: "g_1", assetId: "a27", x: 1, y: 1 }, // Carpet 1 (Top left)
      { id: "g_2", assetId: "a27", x: 1, y: 9 }, // Carpet 2 (Bottom left)
      { id: "g_3", assetId: "a28", x: 8, y: 1 }, // Central Platform
      { id: "g_4", assetId: "a26", x: 17, y: 1 }, // Wooden Deck (Right)

      // Top Left Carpet Elements
      { id: "g_5", assetId: "a14", x: 2, y: 2 }, // Round Table
      { id: "g_6", assetId: "a29", x: 2, y: 1, rotation: 0 }, // Purple Couch (top)
      { id: "g_7", assetId: "a29", x: 2, y: 4, rotation: 180 }, // Purple Couch (bottom)
      { id: "g_8", assetId: "a29", x: 1, y: 2, rotation: 270 }, // Purple Couch (left)
      { id: "g_9", assetId: "a29", x: 4, y: 2, rotation: 90 }, // Purple Couch (right)

      // Bottom Left Carpet Elements
      { id: "g_10", assetId: "a14", x: 2, y: 10 }, // Round Table
      { id: "g_11", assetId: "a29", x: 2, y: 9, rotation: 0 }, // Purple Couch
      { id: "g_12", assetId: "a29", x: 2, y: 12, rotation: 180 }, // Purple Couch
      { id: "g_13", assetId: "a29", x: 1, y: 10, rotation: 270 }, // Purple Couch
      { id: "g_14", assetId: "a29", x: 4, y: 10, rotation: 90 }, // Purple Couch

      // Trees (Top middle)
      { id: "g_15", assetId: "a24", x: 5, y: 2 },
      { id: "g_16", assetId: "a24", x: 5, y: 6 },

      // Central Platform Elements
      { id: "g_17", assetId: "a11", x: 11, y: 4 }, // Firepit
      { id: "g_18", assetId: "a5", x: 11, y: 2, rotation: 0 }, // Red Couch
      { id: "g_19", assetId: "a5", x: 11, y: 7, rotation: 180 }, // Red Couch
      { id: "g_20", assetId: "a5", x: 9, y: 4, rotation: 270 }, // Red Couch
      { id: "g_21", assetId: "a5", x: 14, y: 4, rotation: 90 }, // Red Couch
      { id: "g_22", assetId: "a10", x: 11, y: 1 }, // Speaker (top of platform)

      // Wooden Deck Elements
      { id: "g_23", assetId: "a13", x: 20, y: 2 }, // Bar Counter
      { id: "g_24", assetId: "a25", x: 18, y: 2 }, // Purple plant
      { id: "g_25", assetId: "a25", x: 18, y: 3 }, // Purple plant
      { id: "g_26", assetId: "a25", x: 18, y: 4 }, // Purple plant
      { id: "g_27", assetId: "a12", x: 22, y: 2 }, // Zen Garden (representing the pool/water)
      { id: "g_28", assetId: "a25", x: 25, y: 2 }, // Purple plant
      { id: "g_29", assetId: "a25", x: 25, y: 3 }, // Purple plant
      { id: "g_30", assetId: "a12", x: 18, y: 9 }, // Large Zen Garden (bottom right)
      // Extra congestion
      { id: "g_31", assetId: "a32", x: 16, y: 5 }, // Cherry blossom
      { id: "g_32", assetId: "a33", x: 24, y: 10 }, // Palm tree
      { id: "g_33", assetId: "a1", x: 1, y: 14 }, // Desk
      { id: "g_34", assetId: "a16", x: 1, y: 15 }, // Chair
      { id: "g_35", assetId: "a1", x: 4, y: 14 }, // Desk
      { id: "g_36", assetId: "a16", x: 4, y: 15 }, // Chair
    ]
  },
  {
    id: "t6",
    title: "Outdoor Park",
    description: "A dense outdoor area with grass, sand and multiple trees",
    iconName: "Trees",
    color: "#22C55E",
    bgTheme: "grass",
    elements: [
      { id: "p_1", assetId: "a34", x: 0, y: 0 }, // Grass
      { id: "p_2", assetId: "a34", x: 5, y: 0 },
      { id: "p_3", assetId: "a34", x: 10, y: 0 },
      { id: "p_4", assetId: "a35", x: 4, y: 6 }, // Sand Pit
      { id: "p_5", assetId: "a36", x: 12, y: 6 }, // Marble Floor
      { id: "p_6", assetId: "a30", x: 1, y: 1 }, // Oak
      { id: "p_7", assetId: "a31", x: 8, y: 1 }, // Pine
      { id: "p_8", assetId: "a32", x: 2, y: 10 }, // Cherry
      { id: "p_9", assetId: "a33", x: 16, y: 2 }, // Palm
      { id: "p_10", assetId: "a30", x: 18, y: 12 }, // Oak
      { id: "p_11", assetId: "a11", x: 5, y: 7 }, // Firepit
      { id: "p_12", assetId: "a5", x: 5, y: 5 }, // Couch
      { id: "p_13", assetId: "a14", x: 13, y: 8 }, // Table
      { id: "p_14", assetId: "a16", x: 12, y: 8 }, // Chair
      { id: "p_15", assetId: "a16", x: 15, y: 8 }, // Chair
      { id: "p_16", assetId: "a16", x: 13, y: 7 }, // Chair
      { id: "p_17", assetId: "a16", x: 13, y: 10 }, // Chair
      { id: "p_18", assetId: "a25", x: 14, y: 7 }, // Plant
      { id: "p_19", assetId: "a4", x: 10, y: 10 }, // Plant
      { id: "p_20", assetId: "a4", x: 10, y: 11 }, // Plant
      { id: "p_21", assetId: "a4", x: 11, y: 10 }, // Plant
      { id: "p_22", assetId: "a4", x: 11, y: 11 }, // Plant
    ]
  }
];

export const mockTeamMembers: TeamMember[] = mockUsers.map((u, i) => ({
  ...u,
  department: ["Engineering", "Design", "Engineering", "Product", "Engineering", "Marketing", "Engineering", "Operations"][i],
  joinedAt: new Date(Date.now() - (i + 1) * 86400000 * 30).toISOString(),
  spacesCount: [6, 4, 3, 5, 2, 1, 4, 3][i],
}));
