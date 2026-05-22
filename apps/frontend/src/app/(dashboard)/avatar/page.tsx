"use client";

import { motion } from "framer-motion";
import {
  Check,
  RotateCcw,
  Shuffle,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Upload,
  Camera,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ColorPickerGroup } from "@/components/ui/color-picker-group";
import { PillGroup } from "@/components/ui/pill-group";
import { AvatarCharacter } from "@/components/avatar/avatar-character";
import { useAvatarConfig, useUpdateAvatarConfig, useResetAvatarConfig, useAuthUser } from "@/hooks/use-queries";
import { useState, useCallback, useEffect } from "react";
import { DEFAULT_AVATAR_CONFIG } from "@/types";
import type { AvatarConfig, HairStyle, OutfitType, AccessoryType, EyeShape, MouthType, FacialHair, OutfitPattern, FaceShape } from "@/types";

// ─── Option Palettes ─────────────────────────────────────────────────
const SKIN_TONES = ["#FDDCB1", "#F5C6A0", "#E8A87C", "#D08B5B", "#A0632C", "#6B3E26", "#3B2314"];
const HAIR_COLORS = ["#2C1B0E", "#5A3214", "#8B4513", "#D4A04C", "#C41E3A", "#4A0080", "#1E90FF", "#10B981", "#F5F5DC"];
const EYE_COLORS = ["#1E293B", "#4A3728", "#2E7D32", "#1565C0", "#6A1B9A", "#BF360C", "#78909C"];
const OUTFIT_COLORS = ["#6D3BD7", "#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#1E293B", "#F97316"];

const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value: "bald", label: "Bald" },
  { value: "crew-cut", label: "Crew Cut" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
  { value: "curly", label: "Curly" },
  { value: "ponytail", label: "Ponytail" },
  { value: "bun", label: "Bun" },
];

const EYE_SHAPES: { value: EyeShape; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "squint", label: "Squint" },
  { value: "wide", label: "Wide" },
  { value: "cool", label: "Cool" },
];

const FACE_SHAPES: { value: FaceShape; label: string }[] = [
  { value: "oval", label: "Oval" },
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "heart", label: "Heart" },
];

const MOUTH_TYPES: { value: MouthType; label: string }[] = [
  { value: "smile", label: "Smile" },
  { value: "neutral", label: "Neutral" },
  { value: "surprised", label: "Surprised" },
  { value: "cool", label: "Cool" },
];

const FACIAL_HAIR_STYLES: { value: FacialHair; label: string }[] = [
  { value: "none", label: "None" },
  { value: "beard", label: "Beard" },
  { value: "mustache", label: "Mustache" },
  { value: "stubble", label: "Stubble" },
];

const OUTFIT_TYPES: { value: OutfitType; label: string; icon: string }[] = [
  { value: "tshirt", label: "T-Shirt", icon: "👕" },
  { value: "hoodie", label: "Hoodie", icon: "🧥" },
  { value: "suit", label: "Suit", icon: "🤵" },
  { value: "dress", label: "Dress", icon: "👗" },
  { value: "tank-top", label: "Tank Top", icon: "🎽" },
];

const OUTFIT_PATTERNS: { value: OutfitPattern; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "stripes", label: "Stripes" },
  { value: "dots", label: "Dots" },
  { value: "checkered", label: "Check" },
  { value: "camo", label: "Camo" },
];

const ACCESSORIES: { value: AccessoryType; label: string; icon: string }[] = [
  { value: "none", label: "None", icon: "❌" },
  { value: "glasses", label: "Glasses", icon: "👓" },
  { value: "headphones", label: "Headphones", icon: "🎧" },
  { value: "hat", label: "Hat", icon: "🎩" },
  { value: "earrings", label: "Earrings", icon: "💎" },
  { value: "mask", label: "Mask", icon: "😷" },
];

// ─── Animations ──────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ─── Section Wrapper ─────────────────────────────────────────────────
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlassCard hover={false} className="p-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer"
        type="button"
      >
        <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider">{title}</h3>
        {open ? (
          <ChevronUp className="w-4 h-4 text-on-surface-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-on-surface-muted" />
        )}
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </GlassCard>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function AvatarPage() {
  const { data: savedConfig, isLoading } = useAvatarConfig();
  const { data: user } = useAuthUser();
  const updateMutation = useUpdateAvatarConfig();
  const resetMutation = useResetAvatarConfig();

  // Local draft state for live editing
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [facing, setFacing] = useState<"down" | "up" | "left" | "right">("down");
  const [walkPreview, setWalkPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync when saved config loads
  useEffect(() => {
    if (savedConfig) setConfig(savedConfig);
  }, [savedConfig]);

  const update = useCallback(
    (patch: Partial<AvatarConfig>) => {
      setConfig((prev) => ({ ...prev, ...patch }));
      setSaved(false);
    },
    []
  );

  const handleSave = () => {
    updateMutation.mutate(config, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: (data) => {
        setConfig(data);
      },
    });
  };

  const handleRandomize = () => {
    const pick = <T,>(arr: { value: T }[]): T => arr[Math.floor(Math.random() * arr.length)].value;
    const pickColor = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];
    update({
      skinTone: pickColor(SKIN_TONES),
      faceShape: pick(FACE_SHAPES),
      hairStyle: pick(HAIR_STYLES),
      hairColor: pickColor(HAIR_COLORS),
      facialHair: pick(FACIAL_HAIR_STYLES),
      outfit: pick(OUTFIT_TYPES),
      outfitPattern: pick(OUTFIT_PATTERNS),
      outfitColor: pickColor(OUTFIT_COLORS),
      accessory: pick(ACCESSORIES),
      eyeColor: pickColor(EYE_COLORS),
      eyeShape: pick(EYE_SHAPES),
      mouth: pick(MOUTH_TYPES),
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6 pb-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-on-surface">Avatar Customization</h1>
        <p className="text-on-surface-muted mt-1">Design your virtual presence — your character will appear in all spaces</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ────────── Left: Live Preview ────────── */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassCard hover={false} className="p-8 flex flex-col items-center sticky top-6">
            {/* Avatar preview */}
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <AvatarCharacter
                  config={config}
                  size="xl"
                  facing={facing}
                  isMoving={walkPreview}
                  showShadow
                />
              </motion.div>

              {/* Pulsing ring */}
              <motion.div
                className="absolute -inset-6 rounded-full border-2 border-primary/20 pointer-events-none"
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Name */}
            <p className="text-lg font-semibold text-on-surface">{user?.name || "Your Avatar"}</p>
            <p className="text-sm text-on-surface-muted mb-4 capitalize">
              {config.hairStyle} • {config.outfit} • {config.accessory !== "none" ? config.accessory : "No accessory"}
            </p>

            {/* Turntable controls */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-on-surface-muted mr-2 uppercase tracking-wider">Facing</span>
              {([
                { dir: "up" as const, icon: ArrowUp },
                { dir: "down" as const, icon: ArrowDown },
                { dir: "left" as const, icon: ArrowLeft },
                { dir: "right" as const, icon: ArrowRight },
              ]).map(({ dir, icon: Icon }) => (
                <button
                  key={dir}
                  onClick={() => setFacing(dir)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    facing === dir
                      ? "bg-primary/15 text-primary"
                      : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40"
                  }`}
                  type="button"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Walk toggle */}
            <button
              onClick={() => setWalkPreview(!walkPreview)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer mb-5 ${
                walkPreview
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-surface-high/40 text-on-surface-muted hover:text-on-surface"
              }`}
              type="button"
            >
              {walkPreview ? "⏸ Stop Walk" : "🚶 Preview Walk"}
            </button>

            {/* Action buttons */}
            <div className="flex gap-2 w-full">
              <Button
                variant="gradient"
                size="sm"
                className="flex-1"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved!
                  </>
                ) : updateMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} disabled={resetMutation.isPending}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRandomize}>
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ────────── Right: Customization Controls ────────── */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-4">
          {/* Body */}
          <Section title="Body">
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Face Shape</h4>
              <PillGroup
                options={FACE_SHAPES}
                value={config.faceShape}
                onChange={(v) => update({ faceShape: v as FaceShape })}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Skin Tone</h4>
              <ColorPickerGroup colors={SKIN_TONES} value={config.skinTone} onChange={(v) => update({ skinTone: v })} size="lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Eye Shape</h4>
                <PillGroup
                  options={EYE_SHAPES}
                  value={config.eyeShape}
                  onChange={(v) => update({ eyeShape: v as EyeShape })}
                />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Mouth</h4>
                <PillGroup
                  options={MOUTH_TYPES}
                  value={config.mouth}
                  onChange={(v) => update({ mouth: v as MouthType })}
                />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Eye Color</h4>
              <ColorPickerGroup colors={EYE_COLORS} value={config.eyeColor} onChange={(v) => update({ eyeColor: v })} size="sm" />
            </div>
          </Section>

          {/* Hair */}
          <Section title="Hair">
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Style</h4>
              <PillGroup
                options={HAIR_STYLES.map((h) => ({ value: h.value, label: h.label }))}
                value={config.hairStyle}
                onChange={(v) => update({ hairStyle: v as HairStyle })}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Facial Hair</h4>
              <PillGroup
                options={FACIAL_HAIR_STYLES}
                value={config.facialHair}
                onChange={(v) => update({ facialHair: v as FacialHair })}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Color</h4>
              <ColorPickerGroup colors={HAIR_COLORS} value={config.hairColor} onChange={(v) => update({ hairColor: v })} size="sm" />
            </div>
          </Section>

          {/* Outfit */}
          <Section title="Outfit">
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Type</h4>
              <PillGroup
                options={OUTFIT_TYPES.map((o) => ({ value: o.value, label: `${o.icon} ${o.label}` }))}
                value={config.outfit}
                onChange={(v) => update({ outfit: v as OutfitType })}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Pattern</h4>
              <PillGroup
                options={OUTFIT_PATTERNS}
                value={config.outfitPattern}
                onChange={(v) => update({ outfitPattern: v as OutfitPattern })}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-on-surface-muted mb-2.5 uppercase tracking-wider">Color</h4>
              <ColorPickerGroup colors={OUTFIT_COLORS} value={config.outfitColor} onChange={(v) => update({ outfitColor: v })} size="sm" />
            </div>
          </Section>

          {/* Accessories */}
          <Section title="Accessories">
            <PillGroup
              options={ACCESSORIES.map((a) => ({ value: a.value, label: `${a.icon} ${a.label}` }))}
              value={config.accessory}
              onChange={(v) => update({ accessory: v as AccessoryType })}
            />
          </Section>

          {/* Photo Upload — Future Feature */}
          <Section title="AI Avatar from Photo" defaultOpen={false}>
            <div className="border-2 border-dashed border-outline-variant/60 rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-primary/60" />
              </div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Upload Your Photo</h4>
              <p className="text-xs text-on-surface-muted mb-4 max-w-xs">
                Upload a selfie and our AI will generate a pixel-art avatar that looks like you.
                This feature will be available when the backend is connected.
              </p>

              {/* File input — stores locally but doesn't process yet */}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-high/40 text-on-surface-muted text-sm font-medium cursor-pointer hover:bg-surface-highest transition-all mb-3">
                <Upload className="w-4 h-4" />
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      update({ photoUrl: url });
                    }
                  }}
                />
              </label>

              {config.photoUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/40 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.photoUrl} alt="Uploaded photo" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary/40 text-sm font-medium cursor-not-allowed"
                type="button"
              >
                <Sparkles className="w-4 h-4" />
                Generate Avatar — Coming Soon
              </button>
            </div>
          </Section>
        </motion.div>
      </div>
    </motion.div>
  );
}
