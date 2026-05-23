// ─── Helpers ───────────────────────────────────────────────────────
export function darkenHex(hex: string, amount: number): string {
  try {
    const clean = hex.replace("#", "");
    const r = Math.max(0, parseInt(clean.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(clean.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(clean.substring(4, 6), 16) - amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return hex;
  }
}
