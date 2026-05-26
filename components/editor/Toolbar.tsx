"use client";

import React, { useRef } from "react";
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Hand,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Layers,
} from "lucide-react";
import { useEditorStore, selectCanUndo, selectCanRedo } from "@/store/editorStore";
import type { Tool, ImageElement, UploadedAsset } from "@/types";

const TOOLS: { id: Tool; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "hand", icon: Hand, label: "Hand", shortcut: "H" },
];

export default function Toolbar() {
  const {
    tool,
    setTool,
    undo,
    redo,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    book,
    isSaving,
    lastSaved,
    addAsset,
    addElement,
    currentPageId,
  } = useEditorStore();

  const canUndo = useEditorStore(selectCanUndo);
  const canRedo = useEditorStore(selectCanRedo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const asset: UploadedAsset = {
            id: crypto.randomUUID(),
            name: file.name,
            src,
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: file.size,
            type: file.type,
          };
          addAsset(asset);
          // Place first image on canvas
          const page = book.pages.find((p) => p.id === currentPageId);
          if (!page) return;
          const maxDim = 300;
          const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
          const element: ImageElement = {
            id: crypto.randomUUID(),
            type: "image",
            src,
            name: file.name,
            x: 50,
            y: 50,
            width: img.naturalWidth * scale,
            height: img.naturalHeight * scale,
            rotation: 0,
            zIndex: page.elements.length,
            opacity: 1,
          };
          addElement(currentPageId, element);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <header className="flex items-center gap-2 px-4 h-14 bg-[#f7f5f1] border-b border-[#d7d1c7] z-50 shrink-0 text-slate-700">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#14B8A6] flex items-center justify-center">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-slate-800 font-semibold text-sm tracking-tight hidden sm:block">
          Studio Álbum
        </span>
      </div>

      {/* Title */}
      <TitleInput />

      <div className="flex-1" />

      {/* Tools */}
      <div className="flex items-center gap-1 bg-[#ebe6dd] rounded-lg p-1 border border-[#ddd5c9]">
        {TOOLS.map(({ id, icon: Icon, label, shortcut }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            title={`${label} (${shortcut})`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tool === id
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/80"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden md:block">{label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-[#d8d1c6] mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-[#d8d1c6] mx-1" />

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          title="Zoom Out (Ctrl+-)"
          className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetZoom}
          className="px-2 py-1 rounded-md text-xs font-mono text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors min-w-[52px] text-center"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={zoomIn}
          title="Zoom In (Ctrl++)"
          className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-[#d8d1c6] mx-1" />

      {/* Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebe6dd] hover:bg-white text-slate-700 text-xs font-medium transition-colors border border-[#ddd5c9]"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Upload</span>
      </button>

      {/* Save indicator */}
      <div className="ml-2 text-slate-400 text-xs hidden md:block">
        {isSaving ? (
          <span className="animate-pulse">Saving…</span>
        ) : lastSaved ? (
          <span>Saved</span>
        ) : null}
      </div>
    </header>
  );
}

function TitleInput() {
  const { book, setTitle } = useEditorStore();
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(book.title);

  return editing ? (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (value.trim()) setTitle(value.trim());
        else setValue(book.title);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setValue(book.title);
          setEditing(false);
        }
      }}
      className="bg-white text-slate-800 text-sm font-medium px-2 py-1 rounded-md outline-none border border-[#d7d1c7] focus:border-[#FF6B6B]/60 max-w-[200px]"
    />
  ) : (
    <button
      onClick={() => { setEditing(true); setValue(book.title); }}
      className="text-slate-700 text-sm font-medium hover:text-slate-900 transition-colors px-1 max-w-[200px] truncate"
    >
      {book.title}
    </button>
  );
}
