"use client";

import React from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export default function ZoomControls() {
  const { zoom, setZoom, zoomIn, zoomOut, resetZoom } = useEditorStore();

  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-[#0F172A]/90 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-1.5 shadow-xl z-20">
      <button
        onClick={zoomOut}
        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <select
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="bg-transparent text-white/80 text-xs font-mono focus:outline-none cursor-pointer px-1 [&>option]:bg-[#0F172A]"
      >
        {ZOOM_PRESETS.map((z) => (
          <option key={z} value={z}>
            {Math.round(z * 100)}%
          </option>
        ))}
      </select>

      <button
        onClick={zoomIn}
        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      <button
        onClick={resetZoom}
        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        title="Fit to screen"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
}
