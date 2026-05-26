"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import PageNavigator from "./PageNavigator";
import ZoomControls from "./ZoomControls";
import { useEditorStore } from "@/store/editorStore";
import { useKeyboardShortcuts, useAutoSave } from "@/hooks/useEditor";

// Konva must be loaded client-side only
const CanvasPage = dynamic(() => import("./CanvasPage"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF6B6B] rounded-full animate-spin" />
    </div>
  ),
});

export default function BookEditor() {
  useKeyboardShortcuts();
  useAutoSave();

  const { currentPageId, normalizePagesToFourThree } = useEditorStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    normalizePagesToFourThree();
  }, [normalizePagesToFourThree]);

  return (
    <div className="flex flex-col h-screen bg-[#ece9e3] overflow-hidden text-slate-800">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main canvas area */}
        <main
          ref={canvasContainerRef}
          className="flex-1 overflow-auto bg-[#efede8] relative"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="min-h-full flex items-center justify-center p-10">
            <CanvasPage pageId={currentPageId} />
          </div>

          <ZoomControls />
        </main>

        {/* Right page navigator */}
        <PageNavigator />
      </div>
    </div>
  );
}
