"use client";

import { Asset } from "@/types";

export const TopDownAssetRenderer = ({ asset, customColor }: { asset: Asset, customColor?: string }) => {
  switch (asset.name) {
    case "Couch":
    case "Purple Couch":
      const isPurple = asset.name === "Purple Couch";
      const baseColor = isPurple ? "#581C87" : "#B22222";
      const darkColor = isPurple ? "#3B0764" : "#8B0000";
      const cushionColor = isPurple ? "#7E22CE" : "#CD5C5C";
      return (
        <div className="w-full h-full rounded-sm relative shadow-[0_5px_15px_rgba(0,0,0,0.6)] border-[2px] overflow-hidden" style={{ backgroundColor: baseColor, borderColor: darkColor }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
          <div className="absolute top-0 left-0 w-full h-[35%] rounded-b-sm opacity-90 shadow-lg z-10" style={{ backgroundColor: darkColor }} />
          <div className="absolute top-0 left-0 w-[20%] h-full rounded-r-sm opacity-90 shadow-lg z-10" style={{ backgroundColor: darkColor }} />
          <div className="absolute top-0 right-0 w-[20%] h-full rounded-l-sm opacity-90 shadow-lg z-10" style={{ backgroundColor: darkColor }} />
          <div className="absolute bottom-[5%] left-[20%] right-[20%] h-[60%] flex gap-1 px-1 z-0">
            <div className="flex-1 rounded-sm shadow-inner border opacity-90" style={{ backgroundColor: cushionColor, borderColor: `${darkColor}50` }} />
            <div className="flex-1 rounded-sm shadow-inner border opacity-90" style={{ backgroundColor: cushionColor, borderColor: `${darkColor}50` }} />
          </div>
        </div>
      );
    case "Tree":
    case "Oak Tree":
    case "Pine Tree":
    case "Cherry Blossom":
    case "Palm Tree":
      const isPine = asset.name === "Pine Tree";
      const isCherry = asset.name === "Cherry Blossom";
      const isPalm = asset.name === "Palm Tree";
      
      const leafColor = isCherry ? '#F472B6' : (isPine ? '#064E3B' : (isPalm ? '#10B981' : '#064E3B'));
      const leafSecondary = isCherry ? '#FB7185' : (isPine ? '#022C22' : (isPalm ? '#059669' : '#022C22'));
      const leafAccent = isCherry ? '#FDA4AF' : (isPine ? '#047857' : (isPalm ? '#34D399' : '#115E59'));
      
      return (
        <div className="w-full h-full relative flex items-center justify-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
          {/* Base */}
          <div className="absolute w-[20%] h-[20%] bg-[#475569] rounded-full shadow-inner border border-[#1E293B]" />
          
          {isPalm ? (
            <div className="w-full h-full relative flex justify-center items-center">
              <div className="absolute w-[15%] h-[40%] bg-[#D97706] rounded-full" />
              {[0, 60, 120, 180, 240, 300].map((rot) => (
                <div key={rot} className="absolute w-[40%] h-[15%] rounded-full opacity-90 shadow-md" style={{ transform: `rotate(${rot}deg) translateX(40%)`, backgroundColor: leafColor, border: `1px solid ${leafSecondary}` }} />
              ))}
            </div>
          ) : (
            <div className={`w-[90%] h-[90%] bg-[radial-gradient(circle_at_30%_30%,${leafAccent},${leafColor},${leafSecondary})] rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.7)] border border-[${leafSecondary}] relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(${leafAccent} 1px, transparent 1px)`, backgroundSize: '8px 8px', backgroundPosition: '2px 2px' }} />
              {isPine && (
                 <div className="absolute inset-0 opacity-40 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_10deg,rgba(0,0,0,0.2)_10deg,rgba(0,0,0,0.2)_20deg)]" />
              )}
            </div>
          )}
        </div>
      );
    case "Purple Plant":
      return (
        <div className="w-full h-full relative flex items-center justify-center drop-shadow-md">
          {/* Soil/Pot base */}
          <div className="absolute w-1/2 h-1/2 bg-[#3E1F07] rounded-full" />
          {/* Purple leaves cluster */}
          <div className="w-[70%] h-[70%] bg-[radial-gradient(circle_at_30%_30%,#A855F7,#6B21A8,#4C1D95)] rounded-full rotate-45 shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.5)] border border-[#4C1D95]" />
          <div className="absolute w-[60%] h-[60%] bg-[radial-gradient(circle_at_30%_30%,#C084FC,#7E22CE,#581C87)] rounded-full -rotate-12 shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.5)]" />
        </div>
      );
    case "Grass Patch":
      return (
        <div className="w-full h-full rounded-sm relative overflow-hidden" style={{ backgroundColor: customColor || '#22C55E' }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-radial-gradient(circle at 10% 10%, transparent 0, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 6px)' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }} />
        </div>
      );
    case "Sand Pit":
      return (
        <div className="w-full h-full rounded-sm relative overflow-hidden" style={{ backgroundColor: customColor || '#FDE047' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
        </div>
      );
    case "Marble Floor":
      return (
        <div className="w-full h-full rounded-sm relative overflow-hidden" style={{ backgroundColor: customColor || '#F8FAFC' }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.1) 55%, transparent 55%)', backgroundSize: '20px 20px' }} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(-45deg, transparent 45%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.1) 55%, transparent 55%)', backgroundSize: '30px 30px' }} />
        </div>
      );
    case "Wooden Deck":
      return (
        <div className="w-full h-full rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-l-4 border-r-4 border-[#5C3A21] relative overflow-hidden" style={{ backgroundColor: customColor || '#8B5A2B' }}>
          {/* Wood planks */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(0,0,0,0.4) 38px, rgba(0,0,0,0.4) 40px)` }} />
          {/* Wood grain */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(15deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)` }} />
          {/* Lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
      );
    case "Patterned Carpet":
      return (
        <div className="w-full h-full rounded-sm shadow-sm border-[4px] border-[#374151] relative overflow-hidden" style={{ backgroundColor: customColor || '#1F2937' }}>
          {/* Carpet pattern */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, #8B5CF6 2px, transparent 3px), radial-gradient(circle at center, #EC4899 1px, transparent 2px)', backgroundSize: '20px 20px, 10px 10px', backgroundPosition: '0 0, 10px 10px' }} />
          {/* Lighting */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20" />
        </div>
      );
    case "Platform":
      return (
        <div className="w-full h-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-[6px] border-[#4A2F1D] relative overflow-hidden" style={{ backgroundColor: customColor || '#374151' }}>
          {/* Concrete/dark tile texture */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          {/* Subtle noise */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
          {/* Metal railing at bottom */}
          <div className="absolute bottom-1 w-full h-2 border-t-2 border-b-2 border-[#9CA3AF] opacity-50 flex justify-evenly">
             <div className="w-0.5 h-full bg-[#9CA3AF]" /><div className="w-0.5 h-full bg-[#9CA3AF]" /><div className="w-0.5 h-full bg-[#9CA3AF]" />
          </div>
        </div>
      );
    case "Meeting Table":
    case "Desk":
    case "Round Table":
    case "Teacher Desk":
      const isRound = asset.name === "Round Table";
      return (
        <div className={`w-full h-full bg-[#8B5A2B] ${isRound ? 'rounded-full' : 'rounded-sm'} shadow-[0_5px_15px_rgba(0,0,0,0.6)] border-[4px] border-[#4A2F1D] relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.3) 5px, rgba(0,0,0,0.3) 10px)' }} />
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
           {asset.name === "Teacher Desk" && (
             <div className="absolute top-2 right-2 w-4 h-6 bg-white/90 shadow-sm rotate-12 flex flex-col gap-0.5 p-0.5">
               <div className="w-full h-[1px] bg-black/20" />
               <div className="w-full h-[1px] bg-black/20" />
             </div>
           )}
           {isRound && (
              <div className="absolute inset-1 border border-[#4A2F1D] rounded-full opacity-30" />
           )}
        </div>
      );
    case "Office Desk":
    case "Student Desk":
      return (
        <div className="w-full h-full bg-[#E2E8F0] rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.4)] border-2 border-[#94A3B8] relative overflow-hidden flex items-center justify-center">
          {/* Subtle noise for plastic/metal feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
          {asset.name === "Office Desk" && (
            <>
              {/* Keyboard */}
              <div className="absolute bottom-2 w-8 h-3 bg-[#334155] rounded-sm shadow-sm" />
              {/* Monitor */}
              <div className="absolute top-1 w-12 h-2 bg-[#1E293B] shadow-lg rounded-sm" />
            </>
          )}
          {asset.name === "Student Desk" && (
             <div className="absolute top-1 right-1 w-2 h-3 bg-white/80 shadow-sm rotate-[-15deg]" />
          )}
        </div>
      );
    case "Office Chair":
      return (
        <div className="w-full h-full relative flex items-center justify-center drop-shadow-lg">
          {/* Star base */}
          <div className="absolute w-full h-full rounded-full border-4 border-[#475569] border-dashed opacity-50" />
          <div className="absolute w-2 h-full bg-[#475569] rounded-full rotate-45" />
          <div className="absolute w-2 h-full bg-[#475569] rounded-full -rotate-45" />
          {/* Seat */}
          <div className="w-3/4 h-3/4 bg-[#1E293B] rounded-md shadow-inner border border-[#0F172A] z-10" />
          {/* Backrest */}
          <div className="absolute top-0 w-2/3 h-1/4 bg-[#0F172A] rounded-t-lg z-20 shadow-md" />
        </div>
      );
    case "Plant":
      return (
        <div className="w-full h-full relative flex items-center justify-center drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]">
          {/* Pot with gradient */}
          <div className="absolute w-3/4 h-3/4 bg-[radial-gradient(circle_at_30%_30%,#A0522D,#5C2E0B)] rounded-full border-2 border-[#3E1F07] shadow-inner" />
          {/* Leaves */}
          <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_30%_30%,#32CD32,#006400)] rounded-tl-full opacity-95 -mt-3 -ml-3 shadow-md" />
          <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_70%_30%,#228B22,#004d00)] rounded-tr-full opacity-95 -mt-3 ml-3 shadow-md" />
          <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_30%_70%,#3CB371,#006400)] rounded-bl-full opacity-95 mt-3 -ml-3 shadow-md" />
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,#228B22,#004d00)] rounded-full opacity-90 scale-75 shadow-lg" />
        </div>
      );
    case "Firepit":
      return (
        <div className="w-full h-full relative flex items-center justify-center drop-shadow-2xl">
          {/* Stone ring with texture */}
          <div className="absolute w-[95%] h-[95%] bg-[#696969] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center"
               style={{ backgroundImage: 'radial-gradient(#808080 20%, transparent 20%), radial-gradient(#808080 20%, transparent 20%)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
            <div className="w-[70%] h-[70%] bg-[#1A1A1A] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] relative flex items-center justify-center">
              {/* Coals */}
              <div className="absolute w-full h-full bg-[radial-gradient(circle,rgba(255,69,0,0.4)_0%,transparent_70%)] rounded-full animate-pulse" />
              {/* Flames */}
              <div className="w-1/2 h-1/2 bg-[#FF4500] rounded-full blur-[3px] animate-pulse shadow-[0_0_15px_#FF4500]" />
              <div className="absolute w-1/3 h-1/3 bg-[#FFD700] rounded-full blur-[2px] animate-pulse shadow-[0_0_10px_#FFD700]" style={{ animationDelay: '0.1s' }} />
              <div className="absolute w-1/4 h-1/4 bg-white rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      );
    case "Zen Garden":
      return (
        <div className="w-full h-full bg-[#E6C280] rounded-sm border-[6px] border-[#8B5A2B] shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-radial-gradient(circle at 40% 40%, transparent, transparent 8px, #C29B62 8px, #C29B62 10px)' }} />
          <div className="absolute top-1/4 left-1/4 w-5 h-6 bg-[radial-gradient(circle_at_30%_30%,#A9A9A9,#696969)] rounded-[40%] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] rotate-45" />
          <div className="absolute bottom-1/3 right-1/4 w-7 h-5 bg-[radial-gradient(circle_at_30%_30%,#808080,#555555)] rounded-full shadow-[2px_2px_5px_rgba(0,0,0,0.5)] -rotate-12" />
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#4F4F4F] rounded-full shadow-[1px_1px_3px_rgba(0,0,0,0.5)]" />
        </div>
      );
    case "Bar Counter":
      return (
        <div className="w-full h-full bg-[#3e2723] rounded-sm border-2 border-[#1b0000] shadow-[0_5px_15px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)' }} />
          <div className="absolute top-1 left-1 right-1 bottom-1 bg-[#5d4037] rounded-sm shadow-inner" />
          {/* Stools (implied underneath) */}
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-[#1b0000] rounded-full" />
          <div className="absolute -bottom-2 left-12 w-4 h-4 bg-[#1b0000] rounded-full" />
          {/* Drinks */}
          <div className="absolute top-2 left-4 w-2 h-2 bg-white/60 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          <div className="absolute top-3 right-6 w-3 h-3 bg-[#FF8C00] rounded-full shadow-[0_0_5px_rgba(255,140,0,0.8)]" />
        </div>
      );
    case "Filing Cabinet":
      return (
        <div className="w-full h-full bg-[#94A3B8] rounded-sm shadow-lg border-2 border-[#475569] flex flex-col justify-evenly p-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
          <div className="w-full h-1 bg-[#475569]/50 rounded-full shadow-inner" />
          <div className="w-full h-1 bg-[#475569]/50 rounded-full shadow-inner" />
          <div className="w-full h-1 bg-[#475569]/50 rounded-full shadow-inner" />
        </div>
      );
    case "Water Cooler":
      return (
        <div className="w-full h-full bg-[#F1F5F9] rounded-sm shadow-lg border-2 border-[#CBD5E1] relative flex items-center justify-center">
          {/* Water bottle on top */}
          <div className="w-[80%] h-[80%] bg-[#38BDF8]/40 rounded-full border-2 border-[#0EA5E9]/50 shadow-[inset_0_0_10px_rgba(56,189,248,0.5)] flex items-center justify-center">
             <div className="w-1/2 h-1/2 bg-white/30 rounded-full" />
          </div>
          {/* Drip tray */}
          <div className="absolute bottom-0 w-1/2 h-1 bg-[#94A3B8] rounded-t-sm" />
        </div>
      );
    case "Cubicle Wall":
      return (
        <div className="w-full h-full bg-[#CBD5E1] rounded-sm shadow-md border-[3px] border-[#94A3B8] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
          <div className="absolute top-0 w-full h-[20%] bg-[#64748B] opacity-50" />
        </div>
      );
    case "Chalkboard":
      return (
        <div className="w-full h-full bg-[#064E3B] rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-[4px] border-[#78350F] relative overflow-hidden flex items-center justify-center">
          {/* Chalk dust smudges */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIiBmaWx0ZXI9ImJsdXIoMHB4KSIvPjwvc3ZnPg==')]" style={{ backgroundSize: '100% 100%' }} />
          <div className="absolute bottom-0 w-full h-1.5 bg-[#451A03]" />
          <div className="absolute bottom-1 right-4 w-4 h-1 bg-white/80 rounded-full" />
          <div className="absolute bottom-1 right-2 w-2 h-1 bg-white/80 rounded-full" />
        </div>
      );
    case "Server Rack":
      return (
        <div className="w-full h-full bg-[#0F172A] rounded-sm shadow-xl border-[3px] border-[#1E293B] relative overflow-hidden p-1 flex flex-col gap-1">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white/20 to-transparent" />
          <div className="w-full flex-1 bg-[#1E293B] flex items-center justify-start px-1 gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </div>
          <div className="w-full flex-1 bg-[#1E293B] flex items-center justify-start px-1 gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="w-full flex-1 bg-[#1E293B] flex items-center justify-start px-1 gap-1">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          </div>
          <div className="w-full flex-1 bg-[#1E293B] flex items-center justify-start px-1 gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      );
    case "Private Zone":
    case "Break Area":
      return (
        <div className="w-full h-full relative overflow-hidden rounded-lg border-2 border-dashed border-white/20" style={{ backgroundColor: customColor ? `${customColor}30` : '#6366F11a' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <span className="absolute bottom-2 right-2 text-xl opacity-50">{asset.icon}</span>
        </div>
      );
    case "Whiteboard":
    case "Projector Screen":
      return (
        <div className="w-full h-full bg-white rounded-sm border-2 border-[#A9A9A9] shadow-md flex items-center justify-center relative">
           <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-black to-transparent" />
          <div className="w-[90%] h-[80%] border border-[#E0E0E0] rounded-sm" />
          <div className="absolute bottom-0 w-1/3 h-1.5 bg-[#696969] rounded-t-sm shadow-sm" />
        </div>
      );
    case "Bookshelf":
      return (
        <div className="w-full h-full bg-[#5C2E0B] rounded-sm border-[3px] border-[#3E1F07] shadow-lg flex flex-col justify-evenly p-0.5 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)' }} />
          <div className="w-full h-[3px] bg-[#3E1F07] shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          <div className="w-full h-[3px] bg-[#3E1F07] shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          <div className="w-full flex gap-1 px-1 mt-1">
            <div className="w-2 h-4 bg-[#8B0000] shadow-sm rounded-sm" />
            <div className="w-1.5 h-3 bg-[#00008B] shadow-sm rounded-sm" />
            <div className="w-2 h-4 bg-[#006400] shadow-sm rounded-sm" />
            <div className="w-1 h-4 bg-[#DAA520] shadow-sm rounded-sm" />
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-surface-highest rounded-md border border-outline-variant shadow-sm flex items-center justify-center">
          <span className="text-xl opacity-80">{asset.icon}</span>
        </div>
      );
  }
};
