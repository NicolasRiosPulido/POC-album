import { useEffect, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    deleteElement,
    duplicateElement,
    bringToFront,
    sendToBack,
    selectedElementId,
    currentPageId,
    tool,
    setTool,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useEditorStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes("Mac");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement;

      // Skip shortcuts when typing in input/textarea
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // Undo/Redo
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        e.preventDefault();
        deleteElement(currentPageId, selectedElementId);
        return;
      }

      // Duplicate
      if (ctrl && e.key === "d" && selectedElementId) {
        e.preventDefault();
        duplicateElement(currentPageId, selectedElementId);
        return;
      }

      // Bring to front / send to back
      if (ctrl && e.key === "]" && selectedElementId) {
        e.preventDefault();
        bringToFront(currentPageId, selectedElementId);
        return;
      }
      if (ctrl && e.key === "[" && selectedElementId) {
        e.preventDefault();
        sendToBack(currentPageId, selectedElementId);
        return;
      }

      // Zoom
      if (ctrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        resetZoom();
        return;
      }

      // Tool shortcuts
      if (e.key === "v" && !ctrl) { setTool("select"); return; }
      if (e.key === "t" && !ctrl) { setTool("text"); return; }
      if (e.key === "h" && !ctrl) { setTool("hand"); return; }
    },
    [undo, redo, deleteElement, duplicateElement, bringToFront, sendToBack, selectedElementId, currentPageId, tool, setTool, zoomIn, zoomOut, resetZoom]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useAutoSave() {
  const { book, setSaving, setLastSaved } = useEditorStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaving(true);
      try {
        localStorage.setItem("studio-album-book", JSON.stringify(book));
        setLastSaved(new Date().toISOString());
      } catch {
        // storage quota or other error — ignore
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [book, setSaving, setLastSaved]);
}
