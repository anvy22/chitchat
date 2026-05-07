import Link from "next/link";
import { ChevronLeft, Pencil, MessageSquare, Users, Settings, Maximize, Minimize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Space } from "@/types";

interface RoomHeaderProps {
  space: Space;
  spaceId: string;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export function RoomHeader({
  space,
  spaceId,
  chatOpen,
  setChatOpen,
  isFullscreen,
  toggleFullscreen,
}: RoomHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Link href="/spaces">
          <button className="p-2 rounded-lg hover:bg-surface-high/40 text-on-surface-muted transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <span className="text-2xl">{space.thumbnail}</span>
        <div>
          <h1 className="text-lg font-semibold text-on-surface">{space.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              In Room
            </Badge>
            <span className="text-xs text-on-surface-muted">
              Use WASD or Arrow Keys to move
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/editor?id=${spaceId}`}>
          <Button variant="ghost" size="sm">
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setChatOpen(!chatOpen)}>
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Chat</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">1</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
