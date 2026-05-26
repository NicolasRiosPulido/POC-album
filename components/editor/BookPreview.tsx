"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import type { Book, CanvasElement, Page } from "@/types";

type Spread = {
  leftPage: Page;
  rightPage: Page | null;
  label: string;
};

function computeSpreads(pages: Page[]): Spread[] {
  const spreads: Spread[] = [];

  for (let index = 0; index < pages.length; index += 2) {
    const leftPage = pages[index];
    const rightPage = pages[index + 1] ?? null;

    spreads.push({
      leftPage,
      rightPage,
      label: rightPage
        ? `Pages ${index + 1}-${index + 2}`
        : `Page ${index + 1}`,
    });
  }

  return spreads;
}

function chooseNewestBook(liveBook: Book, persistedBook: Book | null): Book {
  if (!persistedBook) return liveBook;
  const liveTime = Date.parse(liveBook.updatedAt);
  const persistedTime = Date.parse(persistedBook.updatedAt);
  return persistedTime > liveTime ? persistedBook : liveBook;
}

function elementRotationTransform(element: CanvasElement): string | undefined {
  if (!element.rotation) return undefined;
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  return `rotate(${element.rotation} ${centerX} ${centerY})`;
}

function StaticPage({ page, shadowSide }: { page: Page | null; shadowSide: "left" | "right" }) {
  if (!page) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#f8f5ef]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.05),_transparent_70%)]" />
      </div>
    );
  }

  const sortedElements = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <svg
        viewBox={`0 0 ${page.width} ${page.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
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

      <div
        className="pointer-events-none absolute inset-y-0 w-16"
        style={
          shadowSide === "left"
            ? {
                right: 0,
                background:
                  "linear-gradient(to right, transparent, rgba(15,23,42,0.12))",
              }
            : {
                left: 0,
                background:
                  "linear-gradient(to left, transparent, rgba(15,23,42,0.12))",
              }
        }
      />
    </div>
  );
}

export default function BookPreview() {
  const { book: liveBook, currentPageId } = useEditorStore();
  const [persistedBook] = useState<Book | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const saved = window.localStorage.getItem("studio-album-book");
      if (!saved) return null;
      const parsed = JSON.parse(saved) as Book;
      return parsed?.pages?.length ? parsed : null;
    } catch {
      return null;
    }
  });
  const [selectedPageId, setSelectedPageId] = useState(currentPageId);

  const book = useMemo(
    () => chooseNewestBook(liveBook, persistedBook),
    [liveBook, persistedBook]
  );

  const spreads = useMemo(() => computeSpreads(book.pages), [book.pages]);

  const activeSpreadIndex = Math.max(
    0,
    spreads.findIndex(
      (spread) =>
        spread.leftPage.id === selectedPageId || spread.rightPage?.id === selectedPageId
    )
  );

  if (!spreads.length) {
    return (
      <div className="min-h-screen bg-[#efebe5] px-6 py-10 text-slate-700">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#d9d1c5] bg-[#faf8f4] p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 text-slate-800">
            <BookOpen className="h-6 w-6 text-[#ff6b6b]" />
            <h1 className="text-2xl font-semibold">Book Preview</h1>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            There are no pages to preview yet. Add content in the editor first.
          </p>
          <Link
            href="/editor"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>
        </div>
      </div>
    );
  }

  const activeSpread = spreads[activeSpreadIndex];

  return (
    <div className="min-h-screen bg-[#ebe7df] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-full border border-[#d9d1c5] bg-[#f8f5f0]/90 px-5 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Book Preview
            </p>
            <h1 className="text-lg font-semibold text-slate-800">{book.title}</h1>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-full border border-[#d9d1c5] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#f3efe8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="relative isolate">
            <div className="absolute inset-0 translate-y-4 rounded-[24px] bg-[#e4ddd1]" />
            <div className="absolute inset-0 translate-y-8 rounded-[24px] bg-[#d6cec1]" />
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_35px_90px_rgba(15,23,42,0.22)]">
              <div className="flex items-stretch bg-[#f7f3ed]">
                <div className="relative aspect-[4/3] w-[min(42vw,620px)] max-w-[620px] min-w-[280px] border-r border-[#ece4d7] bg-white">
                  <StaticPage page={activeSpread.leftPage} shadowSide="left" />
                </div>
                <div className="relative w-8 shrink-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.26),rgba(15,23,42,0.08)_40%,rgba(255,255,255,0.65)_50%,rgba(15,23,42,0.08)_60%,rgba(15,23,42,0.22))]" />
                <div className="relative aspect-[4/3] w-[min(42vw,620px)] max-w-[620px] min-w-[280px] border-l border-[#ece4d7] bg-white">
                  <StaticPage page={activeSpread.rightPage} shadowSide="right" />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.12),transparent_65%)]" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[#d9d1c5] bg-[#f8f5f0] px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <button
              type="button"
              onClick={() =>
                setSelectedPageId(spreads[Math.max(activeSpreadIndex - 1, 0)].leftPage.id)
              }
              disabled={activeSpreadIndex === 0}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="min-w-[140px] text-center text-sm font-medium text-slate-500">
              {activeSpread.label}
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedPageId(
                  spreads[Math.min(activeSpreadIndex + 1, spreads.length - 1)].leftPage.id
                )
              }
              disabled={activeSpreadIndex === spreads.length - 1}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
