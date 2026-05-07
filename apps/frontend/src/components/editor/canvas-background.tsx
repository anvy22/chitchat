import type { BackgroundTheme } from "@/types";

interface CanvasBackgroundProps {
  bgTheme: BackgroundTheme;
  bgColor: string;
  bgSize: string;
  bgPos: string;
}

export function CanvasBackground({ bgTheme, bgColor, bgSize, bgPos }: CanvasBackgroundProps) {
  return (
    <>
      {bgTheme === 'dark-tiles' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#1E1E1E',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.4) 2px, transparent 2px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, #000 100%)' }} />
        </div>
      )}
      {bgTheme === 'wood-floor' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#8B5A2B',
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.2) 2px, transparent 2px), repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, #2A1608 100%)' }} />
        </div>
      )}
      {bgTheme === 'concrete' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#64748B',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, #0F172A 100%)' }} />
        </div>
      )}
      {bgTheme === 'blue-carpet' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#1E3A8A',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, #000 100%)' }} />
        </div>
      )}
      {bgTheme === 'grass' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#22C55E',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
        </div>
      )}
      {bgTheme === 'sand' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#FDE047',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
        </div>
      )}
      {bgTheme === 'marble' && (
        <div className="absolute inset-0 canvas-bg pointer-events-auto" style={{
          backgroundColor: bgColor || '#F8FAFC',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.05) 55%, transparent 55%)', backgroundSize: '100px 100px' }} />
        </div>
      )}
    </>
  );
}
