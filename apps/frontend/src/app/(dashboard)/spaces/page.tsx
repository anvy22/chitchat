"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Trash2, Layers, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useSpaces, useDeleteSpace } from "@/hooks/use-queries";
import { SPACE_CARD_THEMES } from "@/constants/strings";
import { SpaceCard } from "@/components/spaces/space-card";
import { DeleteSpaceModal } from "@/components/spaces/delete-space-modal";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};



export default function SpacesPage() {
  const { data: spaces, isLoading } = useSpaces();
  const deleteSpace = useDeleteSpace();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpaces = spaces?.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSpace.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Spaces</h1>
          <p className="text-on-surface-muted mt-1">Your virtual collaboration spaces</p>
        </div>
        <Link href="/editor">
          <Button variant="gradient" size="sm">
            <Plus className="w-4 h-4" /> Create Space
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search spaces…"
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredSpaces && filteredSpaces.length > 0 ? (
        <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space, index) => {
            const theme = SPACE_CARD_THEMES[index % SPACE_CARD_THEMES.length];

            return (
              <motion.div key={space.id} variants={fadeUp}>
                <SpaceCard 
                  space={space} 
                  theme={theme} 
                  onDeleteClick={(id, name) => setDeleteTarget({ id, name })} 
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty state */
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-surface-high/50 border border-outline-variant flex items-center justify-center mb-6">
            <Layers className="w-10 h-10 text-on-surface-muted/40" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-2">No spaces yet</h3>
          <p className="text-sm text-on-surface-muted max-w-sm mb-6">
            Create your first virtual workspace to start collaborating with your team.
          </p>
          <Link href="/editor">
            <Button variant="gradient" size="md">
              <Plus className="w-4 h-4" /> Create Your First Space
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteSpaceModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        handleDelete={handleDelete}
        isPending={deleteSpace.isPending}
      />
    </motion.div>
  );
}
