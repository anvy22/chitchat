import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatPanelProps {
  chatOpen: boolean;
  messagesLoading: boolean;
  messages?: Message[];
}

export function ChatPanel({ chatOpen, messagesLoading, messages }: ChatPanelProps) {
  return (
    <AnimatePresence initial={false}>
      {chatOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 340, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          className="hidden md:block overflow-hidden shrink-0"
        >
          <div className="w-[340px] h-full flex flex-col glass-card-static rounded-2xl">
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="font-semibold text-on-surface">Chat</h3>
              <p className="text-xs text-on-surface-muted">{messages?.length || 0} messages</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                messages?.map((msg) => (
                  <div key={msg.id} className="flex gap-2.5">
                    <Avatar initials={msg.userAvatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-on-surface">{msg.userName.split(" ")[0]}</span>
                        <span className="text-xs text-on-surface-muted">{formatRelativeTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <Input placeholder="Type a message…" className="flex-1" />
                <button className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-light transition-colors cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
