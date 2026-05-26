"use client";

import React from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import type { CanvasElement, Page } from "@/types";

function elementRotationTransform(element: CanvasElement): string | undefined {
  if (!element.rotation) return undefined;
  const cx = element.x + element.width / 2;
  const cy = element.y + element.height / 2;
  return `rotate(${element.rotation} ${cx} ${cy})`;
}

function PageThumbnail({ page, index }: { page: Page; index: number }) {
  const sortedElements = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
  const [thumbnailOpacity, setThumbnailOpacity] = React.useState(1);
  const isFirstRenderRef = React.useRef(true);

  const thumbnailSignature = React.useMemo(
    () =>
      JSON.stringify({
        background: page.background,
        elements: sortedElements.map((element) => {
          if (element.type === "image") {
            return {
              id: element.id,
              type: element.type,
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.rotation,
              opacity: element.opacity,
              zIndex: element.zIndex,
              src: element.src,
            };
          }

          return {
            id: element.id,
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation,
            opacity: element.opacity,
            zIndex: element.zIndex,
            content: element.content,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            color: element.color,
            align: element.align,
          };
        }),
      }),
    [page.background, sortedElements]
  );

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    setThumbnailOpacity(0.75);
    const timeoutId = window.setTimeout(() => {
      setThumbnailOpacity(1);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [thumbnailSignature]);

  return (
    <div
      className="aspect-[0.707] w-full overflow-hidden"
      style={{ background: page.background ?? "#ffffff" }}
    >
      <svg
        viewBox={`0 0 ${page.width} ${page.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: thumbnailOpacity, transition: "opacity 180ms ease-out" }}
      >
        <rect
          x={0}
          y={0}
          width={page.width}
          height={page.height}
          fill={page.background ?? "#ffffff"}
        />

        {sortedElements.map((element) => {
          if (element.type === "image") {
            return (
              <image
                key={element.id}
                href={element.src}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                opacity={element.opacity}
                preserveAspectRatio="none"
                transform={elementRotationTransform(element)}
              />
            );
          }

          return (
            <foreignObject
              key={element.id}
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              opacity={element.opacity}
              transform={elementRotationTransform(element)}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: element.color,
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  textAlign: element.align,
                  overflow: "hidden",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {element.content}
              </div>
            </foreignObject>
          );
        })}
      </svg>

      {page.elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-xs font-medium"
            style={{
              color:
                page.background === "#ffffff" || !page.background
                  ? "#ccc"
                  : "rgba(255,255,255,0.3)",
            }}
          >
            {index + 1}
          </span>
        </div>
      )}
    </div>
  );
}

export default function PageNavigator() {
  const {
    book,
    currentPageId,
    setCurrentPage,
    addPage,
    deletePage,
    duplicatePage,
  } = useEditorStore();

  return (
    <aside className="w-44 bg-[#0a0f1e] border-l border-white/10 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Pages ({book.pages.length})
        </span>
        <button
          onClick={addPage}
          className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Add page"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {book.pages.map((page, index) => (
          <div
            key={page.id}
            className={`group relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              currentPageId === page.id
                ? "border-[#FF6B6B] shadow-[0_0_12px_rgba(255,107,107,0.3)]"
                : "border-transparent hover:border-white/20"
            }`}
            onClick={() => setCurrentPage(page.id)}
          >
            {/* Page thumbnail */}
            <PageThumbnail page={page} index={index} />

            {/* Page number badge */}
            <div className="absolute bottom-0 left-0 right-0 py-1 px-1.5 bg-black/40 backdrop-blur-sm">
              <p className="text-white/70 text-[10px] truncate">{page.name}</p>
            </div>

            {/* Actions on hover */}
            <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicatePage(page.id);
                }}
                className="p-0.5 rounded bg-black/50 text-white/70 hover:text-white transition-colors"
                title="Duplicate"
              >
                <Copy className="w-2.5 h-2.5" />
              </button>
              {book.pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className="p-0.5 rounded bg-black/50 text-red-400/70 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add page button */}
        <button
          onClick={addPage}
          className="w-full aspect-[0.707] rounded-lg border-2 border-dashed border-white/10 hover:border-[#FF6B6B]/40 flex items-center justify-center text-white/20 hover:text-[#FF6B6B]/60 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
