"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Plus,
  Trash2,
  Type,
  Upload,
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false);

  const imageUsageBySrc = useMemo(() => {
    const usage = new Map<string, number>();
    for (const page of book.pages) {
      for (const element of page.elements) {
        if (element.type !== "image") continue;
        usage.set(element.src, (usage.get(element.src) ?? 0) + 1);
      }
    }
    return usage;
  }, [book.pages]);

  const processFiles = (files: File[]) => {
    files
      .filter((file) => file.type.startsWith("image/"))
      .forEach((file) => {
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
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(Array.from(files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files ?? []);
    if (!droppedFiles.length) return;
    processFiles(droppedFiles);
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
      content: "Tu texto aqui",
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
    <aside className="w-64 bg-[#f6f3ee] border-r border-[#d7d1c7] flex flex-col shrink-0 overflow-hidden text-slate-700">
      {/* Tabs */}
      <div className="flex border-b border-[#ddd5c9]">
        <button className="flex-1 py-3 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors border-b-2 border-[#FF6B6B]">
          Recursos
        </button>
        <button className="flex-1 py-3 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors">
          Capas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick actions */}
        <div className="p-3 space-y-2">
          <button
            onClick={handleAddText}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#ebe6dd] hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors border border-[#ddd5c9]"
          >
            <Type className="w-3.5 h-3.5 text-[#14B8A6]" />
            Agregar texto
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#ebe6dd] hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors border border-[#ddd5c9]"
          >
            <Upload className="w-3.5 h-3.5 text-[#FF6B6B]" />
            Subir imagen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={handleDrop}
            className={`rounded-lg border border-dashed px-3 py-3 text-center text-xs transition-colors ${
              isDragOver
                ? "border-[#FF6B6B]/70 bg-[#fff1f1] text-slate-800"
                : "border-[#d7d1c7] bg-[#efebe5] text-slate-500"
            }`}
          >
            Arrastra y suelta imagenes aqui
          </div>
        </div>

        {/* Page background */}
        {currentPage && (
          <div className="px-3 pb-3">
            <p className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">
              Fondo
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
              <span className="text-slate-500 text-xs font-mono">
                {currentPage.background}
              </span>
            </div>
          </div>
        )}

        {/* Uploaded images */}
        {assets.length > 0 && (
          <div className="px-3 pb-3">
            <p className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">
              Imagenes ({assets.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAddImageToCanvas(asset)}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-[#ddd5c9] hover:border-[#FF6B6B]/60 transition-all bg-white"
                  title={`Agregar "${asset.name}" al lienzo`}
                >
                  <span className="absolute top-1 left-1 z-10 min-w-[18px] h-[18px] px-1 rounded-full bg-white/90 text-slate-700 text-[10px] font-semibold leading-[18px] text-center border border-[#ddd5c9]">
                    {imageUsageBySrc.get(asset.src) ?? 0}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.src}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <Plus className="w-5 h-5 text-slate-700" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {assets.length === 0 && (
          <div className="px-3 py-6 flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#ebe6dd] flex items-center justify-center border border-[#ddd5c9]">
              <ImageIcon className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-400 text-xs">
              Sube imagenes para agregarlas a tu album
            </p>
          </div>
        )}
      </div>

      {/* Properties panel when element selected */}
      {selectedElement && selectedElementId && (
        <div className="border-t border-[#ddd5c9] p-3 space-y-3 bg-[#f1ede7]">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Propiedades
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPropertiesCollapsed((prev) => !prev)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
                title={isPropertiesCollapsed ? "Mostrar propiedades" : "Ocultar propiedades"}
              >
                {isPropertiesCollapsed ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => deleteElement(currentPageId, selectedElementId)}
                className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Eliminar elemento"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isPropertiesCollapsed && (
            <>
              {/* Position & Size */}
              <div className="grid grid-cols-2 gap-2">
                {(["x", "y", "width", "height"] as const).map((prop) => (
                  <div key={prop}>
                    <label className="text-slate-400 text-xs">{prop.toUpperCase()}</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement[prop as keyof typeof selectedElement] as number)}
                      onChange={(e) =>
                        updateElement(currentPageId, selectedElementId, {
                          [prop]: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#d7d1c7] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#FF6B6B]/60"
                    />
                  </div>
                ))}
              </div>

              {/* Rotation */}
              <div>
                <label className="text-slate-400 text-xs">Rotacion</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.rotation)}
                  onChange={(e) =>
                    updateElement(currentPageId, selectedElementId, {
                      rotation: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-[#d7d1c7] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#FF6B6B]/60"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="text-slate-400 text-xs">
                  Opacidad ({Math.round(selectedElement.opacity * 100)}%)
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
            </>
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
        <label className="text-slate-400 text-xs">Contenido</label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full bg-white border border-[#d7d1c7] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#FF6B6B]/60 resize-none"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-slate-400 text-xs">Tamano de fuente</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full bg-white border border-[#d7d1c7] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#FF6B6B]/60"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs">Color</label>
          <input
            type="color"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-7 rounded bg-transparent border-0 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs">Alinear</label>
        <div className="flex gap-1 mt-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ align: a })}
              className={`flex-1 py-1 rounded text-xs font-medium capitalize transition-colors ${
                element.align === a
                  ? "bg-[#FF6B6B] text-white"
                  : "bg-[#ebe6dd] text-slate-500 hover:bg-white"
              }`}
            >
              {a === "left" ? "izquierda" : a === "center" ? "centro" : "derecha"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
