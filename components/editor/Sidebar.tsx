"use client";

import React, { useRef } from "react";
import {
  ImageIcon,
  Plus,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import {
  useEditorStore,
  selectSelectedElement,
} from "@/store/editorStore";
import type {
  ImageElement,
  TextElement,
  UploadedAsset,
} from "@/types";

export default function Sidebar() {
  const {
    assets,
    addAsset,
    addElement,
    currentPageId,
    book,
    selectedElementId,
    updateElement,
    deleteElement,
    setPageBackground,
  } = useEditorStore();

  const selectedElement = useEditorStore(selectSelectedElement);
  const currentPage = book.pages.find((p) => p.id === currentPageId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddImageToCanvas = (asset: UploadedAsset) => {
    const page = book.pages.find((p) => p.id === currentPageId);
    if (!page) return;
    const maxDim = 300;
    const scale = Math.min(
      maxDim / asset.width,
      maxDim / asset.height,
      1
    );
    const element: ImageElement = {
      id: crypto.randomUUID(),
      type: "image",
      src: asset.src,
      name: asset.name,
      x: 50,
      y: 50,
      width: asset.width * scale,
      height: asset.height * scale,
      rotation: 0,
      zIndex: page.elements.length,
      opacity: 1,
    };
    addElement(currentPageId, element);
  };

  const handleAddText = () => {
    const page = book.pages.find((p) => p.id === currentPageId);
    if (!page) return;
    const element: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 60,
      y: 60,
      width: 250,
      height: 50,
      rotation: 0,
      zIndex: page.elements.length,
      opacity: 1,
      content: "Your text here",
      fontSize: 28,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fontStyle: "normal",
      color: "#0F172A",
      align: "left",
    };
    addElement(currentPageId, element);
  };

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-white/10 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button className="flex-1 py-3 text-xs font-medium text-white/80 hover:text-white transition-colors border-b-2 border-[#FF6B6B]">
          Assets
        </button>
        <button className="flex-1 py-3 text-xs font-medium text-white/40 hover:text-white/70 transition-colors">
          Layers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick actions */}
        <div className="p-3 space-y-2">
          <button
            onClick={handleAddText}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            <Type className="w-3.5 h-3.5 text-[#14B8A6]" />
            Add Text
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#FF6B6B]" />
            Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Page background */}
        {currentPage && (
          <div className="px-3 pb-3">
            <p className="text-white/40 text-xs mb-2 font-medium uppercase tracking-wider">
              Background
            </p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPage.background}
                onChange={(e) =>
                  setPageBackground(currentPageId, e.target.value)
                }
                className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
              />
              <span className="text-white/50 text-xs font-mono">
                {currentPage.background}
              </span>
            </div>
          </div>
        )}

        {/* Uploaded images */}
        {assets.length > 0 && (
          <div className="px-3 pb-3">
            <p className="text-white/40 text-xs mb-2 font-medium uppercase tracking-wider">
              Images ({assets.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAddImageToCanvas(asset)}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#FF6B6B]/60 transition-all"
                  title={`Add "${asset.name}" to canvas`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.src}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {assets.length === 0 && (
          <div className="px-3 py-6 flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-white/40 text-xs">
              Upload images to add them to your book
            </p>
          </div>
        )}
      </div>

      {/* Properties panel when element selected */}
      {selectedElement && selectedElementId && (
        <div className="border-t border-white/10 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Properties
            </p>
            <button
              onClick={() => deleteElement(currentPageId, selectedElementId)}
              className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Position & Size */}
          <div className="grid grid-cols-2 gap-2">
            {(["x", "y", "width", "height"] as const).map((prop) => (
              <div key={prop}>
                <label className="text-white/40 text-xs">{prop.toUpperCase()}</label>
                <input
                  type="number"
                  value={Math.round(selectedElement[prop as keyof typeof selectedElement] as number)}
                  onChange={(e) =>
                    updateElement(currentPageId, selectedElementId, {
                      [prop]: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FF6B6B]/60"
                />
              </div>
            ))}
          </div>

          {/* Rotation */}
          <div>
            <label className="text-white/40 text-xs">Rotation</label>
            <input
              type="number"
              value={Math.round(selectedElement.rotation)}
              onChange={(e) =>
                updateElement(currentPageId, selectedElementId, {
                  rotation: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FF6B6B]/60"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="text-white/40 text-xs">
              Opacity ({Math.round(selectedElement.opacity * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={selectedElement.opacity}
              onChange={(e) =>
                updateElement(currentPageId, selectedElementId, {
                  opacity: Number(e.target.value),
                })
              }
              className="w-full accent-[#FF6B6B]"
            />
          </div>

          {/* Text-specific properties */}
          {selectedElement.type === "text" && (
            <TextProperties
              element={selectedElement as TextElement}
              onUpdate={(updates) =>
                updateElement(currentPageId, selectedElementId, updates)
              }
            />
          )}
        </div>
      )}
    </aside>
  );
}

function TextProperties({
  element,
  onUpdate,
}: {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
}) {
  return (
    <>
      <div>
        <label className="text-white/40 text-xs">Content</label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FF6B6B]/60 resize-none"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-white/40 text-xs">Font Size</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FF6B6B]/60"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs">Color</label>
          <input
            type="color"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-7 rounded bg-transparent border-0 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <label className="text-white/40 text-xs">Align</label>
        <div className="flex gap-1 mt-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ align: a })}
              className={`flex-1 py-1 rounded text-xs font-medium capitalize transition-colors ${
                element.align === a
                  ? "bg-[#FF6B6B] text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
