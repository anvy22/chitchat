"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ColorPickerGroup } from "@/components/ui/color-picker-group";
import { PillGroup } from "@/components/ui/pill-group";
import { useState } from "react";

const skinTones = ["#FDDCB1", "#F5C6A0", "#E8A87C", "#D08B5B", "#A0632C", "#6B3E26"];
const hairColors = ["#2C1B0E", "#5A3214", "#8B4513", "#D4A04C", "#C41E3A", "#4A0080", "#1E90FF", "#10B981"];
const outfitColors = ["#8B5CF6", "#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6"];
const hairStyles = ["Crew Cut", "Medium", "Long", "Curly", "Ponytail", "Bun"];
const accessories = ["None", "Glasses", "Headphones", "Hat", "Earrings", "Mask"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AvatarPage() {
  const [skinTone, setSkinTone] = useState(skinTones[2]);
  const [hairColor, setHairColor] = useState(hairColors[0]);
  const [outfitColor, setOutfitColor] = useState(outfitColors[0]);
  const [hairStyle, setHairStyle] = useState("Medium");
  const [accessory, setAccessory] = useState("None");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-on-surface">Avatar Customization</h1>
        <p className="text-on-surface-muted mt-1">Design your virtual presence</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Preview */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassCard hover={false} className="p-8 flex flex-col items-center">
            <div className="relative mb-6">
              <motion.div
                className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold relative overflow-hidden"
                style={{ backgroundColor: skinTone }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span style={{ color: outfitColor }}>DC</span>
                {/* Outfit indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-12 rounded-b-full" style={{ backgroundColor: outfitColor, opacity: 0.3 }} />
              </motion.div>
              {/* Accessory Badge */}
              {accessory !== "None" && (
                <span className="absolute -top-1 -right-1 bg-surface-highest text-sm px-2 py-1 rounded-full border border-white/10">
                  {accessory === "Glasses" && "👓"}
                  {accessory === "Headphones" && "🎧"}
                  {accessory === "Hat" && "🎩"}
                  {accessory === "Earrings" && "💎"}
                  {accessory === "Mask" && "😷"}
                </span>
              )}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <p className="text-lg font-semibold text-on-surface">Dale Cooper</p>
            <p className="text-sm text-on-surface-muted mb-4">{hairStyle} • {accessory}</p>
            <div className="flex gap-2">
              <Button variant="gradient" size="sm"><Check className="w-4 h-4" /> Save</Button>
              <Button variant="ghost" size="sm"><RotateCcw className="w-4 h-4" /> Reset</Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Controls */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-5">
          {/* Skin Tone */}
          <GlassCard hover={false} className="p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">Skin Tone</h3>
            <ColorPickerGroup colors={skinTones} value={skinTone} onChange={setSkinTone} size="lg" />
          </GlassCard>

          {/* Hair */}
          <GlassCard hover={false} className="p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">Hair Style</h3>
            <div className="mb-4">
              <PillGroup options={hairStyles} value={hairStyle} onChange={setHairStyle} />
            </div>
            <h4 className="text-xs font-semibold text-on-surface-muted mb-2 uppercase tracking-wider">Color</h4>
            <ColorPickerGroup colors={hairColors} value={hairColor} onChange={setHairColor} size="sm" />
          </GlassCard>

          {/* Outfit */}
          <GlassCard hover={false} className="p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">Outfit Color</h3>
            <ColorPickerGroup colors={outfitColors} value={outfitColor} onChange={setOutfitColor} size="sm" />
          </GlassCard>

          {/* Accessories */}
          <GlassCard hover={false} className="p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">Accessory</h3>
            <PillGroup options={accessories} value={accessory} onChange={setAccessory} />
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
