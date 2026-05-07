"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Layers, Users, MonitorSmartphone, BookOpen } from "lucide-react";
import { Asset, Template } from "@/types";

const IconMap: Record<string, React.ElementType> = {
  Users,
  MonitorSmartphone,
  BookOpen,
};

interface AssetPanelProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  assetsLoading: boolean;
  filteredAssets?: Asset[];
  templatesLoading: boolean;
  templates?: Template[];
  loadTemplate: (template: Template) => void;
}

export function AssetPanel({
  categories,
  activeCategory,
  setActiveCategory,
  showTemplates,
  setShowTemplates,
  assetsLoading,
  filteredAssets,
  templatesLoading,
  templates,
  loadTemplate,
}: AssetPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[260px] hidden lg:flex flex-col glass-card-static rounded-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-outline-variant">
        <div className="flex bg-surface-lowest p-1 rounded-xl mb-4 border border-outline-variant">
          <button 
            onClick={() => setShowTemplates(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${!showTemplates ? "bg-surface-highest text-on-surface shadow-sm" : "text-on-surface-muted hover:text-on-surface"}`}
          >
            Elements
          </button>
          <button 
            onClick={() => setShowTemplates(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${showTemplates ? "bg-primary text-white shadow-sm" : "text-on-surface-muted hover:text-on-surface"}`}
          >
            Templates
          </button>
        </div>

        {!showTemplates && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary"
                    : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!showTemplates && (assetsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          filteredAssets?.map((asset) => (
            <div 
              key={asset.id} 
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("assetId", asset.id);
              }}
            >
              <GlassCard className="p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-surface-lowest">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ backgroundColor: `${asset.color}15`, border: `1px solid ${asset.color}30` }}
                >
                  <span className="drop-shadow-sm">{asset.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">{asset.name}</p>
                  <p className="text-xs text-on-surface-muted capitalize">{asset.width}x{asset.height} {asset.category}</p>
                </div>
              </GlassCard>
            </div>
          ))
        ))}

        {showTemplates && (templatesLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          templates?.map((template) => {
            const IconComponent = template.iconName && IconMap[template.iconName] ? IconMap[template.iconName] : Layers;
            return (
              <motion.div 
                key={template.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => loadTemplate(template)}
              >
                <GlassCard className="p-4 flex flex-col gap-3 cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="w-full h-16 rounded-lg bg-surface-highest/20 border border-outline-variant flex items-center justify-center overflow-hidden relative">
                    <IconComponent className="w-6 h-6 opacity-40" style={{ color: template.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{template.title}</p>
                    <p className="text-xs text-on-surface-muted">{template.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        ))}
      </div>
    </motion.div>
  );
}
