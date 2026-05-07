import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteSpaceModalProps {
  deleteTarget: { id: string; name: string } | null;
  setDeleteTarget: (target: { id: string; name: string } | null) => void;
  handleDelete: () => void;
  isPending: boolean;
}

export function DeleteSpaceModal({
  deleteTarget,
  setDeleteTarget,
  handleDelete,
  isPending,
}: DeleteSpaceModalProps) {
  return (
    <AnimatePresence>
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm glass-card-static p-6 rounded-2xl flex flex-col gap-4 border border-white/[0.08] shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-on-surface">Delete Space</h2>
            </div>
            <p className="text-sm text-on-surface-muted">
              Are you sure you want to delete <span className="font-semibold text-on-surface">&ldquo;{deleteTarget.name}&rdquo;</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                variant="gradient"
                className="!bg-gradient-to-r !from-red-600 !to-red-500 hover:!from-red-500 hover:!to-red-400"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4" />
                {isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
