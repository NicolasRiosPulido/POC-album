import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  Book,
  CanvasElement,
  EditorState,
  HistoryEntry,
  Page,
  Tool,
  UploadedAsset,
} from "@/types";

const DEFAULT_PAGE_WIDTH = 794; // A4 at 96dpi
const DEFAULT_PAGE_HEIGHT = 1123;

function createDefaultPage(index: number): Page {
  return {
    id: crypto.randomUUID(),
    name: `Page ${index}`,
    elements: [],
    background: "#ffffff",
    width: DEFAULT_PAGE_WIDTH,
    height: DEFAULT_PAGE_HEIGHT,
  };
}

function createDefaultBook(): Book {
  const page = createDefaultPage(1);
  return {
    id: crypto.randomUUID(),
    title: "My Photo Book",
    pages: [page],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPageId: page.id,
  };
}

interface EditorActions {
  // Page management
  addPage: () => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setCurrentPage: (pageId: string) => void;
  setPageBackground: (pageId: string, color: string) => void;

  // Element management
  addElement: (pageId: string, element: CanvasElement) => void;
  updateElement: (
    pageId: string,
    elementId: string,
    updates: Partial<CanvasElement>
  ) => void;
  deleteElement: (pageId: string, elementId: string) => void;
  duplicateElement: (pageId: string, elementId: string) => void;
  bringToFront: (pageId: string, elementId: string) => void;
  sendToBack: (pageId: string, elementId: string) => void;
  bringForward: (pageId: string, elementId: string) => void;
  sendBackward: (pageId: string, elementId: string) => void;

  // Selection
  selectElement: (elementId: string | null) => void;

  // Tool
  setTool: (tool: Tool) => void;

  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Book metadata
  setTitle: (title: string) => void;

  // Assets
  addAsset: (asset: UploadedAsset) => void;
  removeAsset: (assetId: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Save state
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: string) => void;

  // Reset
  resetEditor: () => void;
}

type EditorStore = EditorState & EditorActions;

const initialBook = createDefaultBook();

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    book: initialBook,
    currentPageId: initialBook.pages[0].id,
    selectedElementId: null,
    zoom: 1,
    tool: "select",
    assets: [],
    history: [{ pages: initialBook.pages, timestamp: Date.now() }],
    historyIndex: 0,
    isSaving: false,
    lastSaved: null,

    pushHistory: () => {
      const { book, history, historyIndex } = get();
      const newEntry: HistoryEntry = {
        pages: JSON.parse(JSON.stringify(book.pages)),
        timestamp: Date.now(),
      };
      const truncated = history.slice(0, historyIndex + 1);
      const newHistory = [...truncated, newEntry].slice(-50); // keep last 50
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex, book } = get();
      if (historyIndex <= 0) return;
      const newIndex = historyIndex - 1;
      set({
        book: { ...book, pages: JSON.parse(JSON.stringify(history[newIndex].pages)) },
        historyIndex: newIndex,
        selectedElementId: null,
      });
    },

    redo: () => {
      const { history, historyIndex, book } = get();
      if (historyIndex >= history.length - 1) return;
      const newIndex = historyIndex + 1;
      set({
        book: { ...book, pages: JSON.parse(JSON.stringify(history[newIndex].pages)) },
        historyIndex: newIndex,
        selectedElementId: null,
      });
    },

    addPage: () => {
      const { book } = get();
      const newPage = createDefaultPage(book.pages.length + 1);
      set((state) => ({
        book: {
          ...state.book,
          pages: [...state.book.pages, newPage],
          updatedAt: new Date().toISOString(),
        },
        currentPageId: newPage.id,
      }));
      get().pushHistory();
    },

    deletePage: (pageId) => {
      const { book, currentPageId } = get();
      if (book.pages.length <= 1) return;
      const filtered = book.pages.filter((p) => p.id !== pageId);
      const newCurrentId =
        currentPageId === pageId ? filtered[0].id : currentPageId;
      set((state) => ({
        book: {
          ...state.book,
          pages: filtered,
          updatedAt: new Date().toISOString(),
        },
        currentPageId: newCurrentId,
        selectedElementId: null,
      }));
      get().pushHistory();
    },

    duplicatePage: (pageId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const newPage: Page = {
        ...JSON.parse(JSON.stringify(page)),
        id: crypto.randomUUID(),
        name: `${page.name} (Copy)`,
        elements: page.elements.map((el) => ({
          ...el,
          id: crypto.randomUUID(),
        })),
      };
      const index = book.pages.findIndex((p) => p.id === pageId);
      const newPages = [...book.pages];
      newPages.splice(index + 1, 0, newPage);
      set((state) => ({
        book: {
          ...state.book,
          pages: newPages,
          updatedAt: new Date().toISOString(),
        },
        currentPageId: newPage.id,
      }));
      get().pushHistory();
    },

    reorderPages: (fromIndex, toIndex) => {
      const { book } = get();
      const pages = [...book.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      set((state) => ({
        book: { ...state.book, pages, updatedAt: new Date().toISOString() },
      }));
      get().pushHistory();
    },

    setCurrentPage: (pageId) => {
      set({ currentPageId: pageId, selectedElementId: null });
    },

    setPageBackground: (pageId, color) => {
      set((state) => ({
        book: {
          ...state.book,
          pages: state.book.pages.map((p) =>
            p.id === pageId ? { ...p, background: color } : p
          ),
          updatedAt: new Date().toISOString(),
        },
      }));
      get().pushHistory();
    },

    addElement: (pageId, element) => {
      set((state) => ({
        book: {
          ...state.book,
          pages: state.book.pages.map((p) =>
            p.id === pageId
              ? { ...p, elements: [...p.elements, element] }
              : p
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: element.id,
      }));
      get().pushHistory();
    },

    updateElement: (pageId, elementId, updates) => {
      set((state) => ({
        book: {
          ...state.book,
          pages: state.book.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === elementId ? ({ ...el, ...updates } as CanvasElement) : el
                  ),
                }
              : p
          ),
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    deleteElement: (pageId, elementId) => {
      set((state) => ({
        book: {
          ...state.book,
          pages: state.book.pages.map((p) =>
            p.id === pageId
              ? { ...p, elements: p.elements.filter((el) => el.id !== elementId) }
              : p
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: null,
      }));
      get().pushHistory();
    },

    duplicateElement: (pageId, elementId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const element = page.elements.find((el) => el.id === elementId);
      if (!element) return;
      const newElement: CanvasElement = {
        ...JSON.parse(JSON.stringify(element)),
        id: crypto.randomUUID(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: Math.max(...page.elements.map((el) => el.zIndex)) + 1,
      };
      set((state) => ({
        book: {
          ...state.book,
          pages: state.book.pages.map((p) =>
            p.id === pageId
              ? { ...p, elements: [...p.elements, newElement] }
              : p
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: newElement.id,
      }));
      get().pushHistory();
    },

    bringToFront: (pageId, elementId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const maxZ = Math.max(...page.elements.map((el) => el.zIndex));
      get().updateElement(pageId, elementId, { zIndex: maxZ + 1 });
      get().pushHistory();
    },

    sendToBack: (pageId, elementId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const minZ = Math.min(...page.elements.map((el) => el.zIndex));
      get().updateElement(pageId, elementId, { zIndex: minZ - 1 });
      get().pushHistory();
    },

    bringForward: (pageId, elementId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const element = page.elements.find((el) => el.id === elementId);
      if (!element) return;
      get().updateElement(pageId, elementId, { zIndex: element.zIndex + 1 });
      get().pushHistory();
    },

    sendBackward: (pageId, elementId) => {
      const { book } = get();
      const page = book.pages.find((p) => p.id === pageId);
      if (!page) return;
      const element = page.elements.find((el) => el.id === elementId);
      if (!element) return;
      get().updateElement(pageId, elementId, { zIndex: element.zIndex - 1 });
      get().pushHistory();
    },

    selectElement: (elementId) => {
      set({ selectedElementId: elementId });
    },

    setTool: (tool) => {
      set({ tool, selectedElementId: null });
    },

    setZoom: (zoom) => {
      set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
    },

    zoomIn: () => {
      const { zoom } = get();
      get().setZoom(Math.min(3, zoom + 0.1));
    },

    zoomOut: () => {
      const { zoom } = get();
      get().setZoom(Math.max(0.1, zoom - 0.1));
    },

    resetZoom: () => {
      set({ zoom: 1 });
    },

    setTitle: (title) => {
      set((state) => ({
        book: {
          ...state.book,
          title,
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    addAsset: (asset) => {
      set((state) => ({ assets: [...state.assets, asset] }));
    },

    removeAsset: (assetId) => {
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== assetId),
      }));
    },

    setSaving: (saving) => {
      set({ isSaving: saving });
    },

    setLastSaved: (date) => {
      set({ lastSaved: date });
    },

    resetEditor: () => {
      const book = createDefaultBook();
      set({
        book,
        currentPageId: book.pages[0].id,
        selectedElementId: null,
        zoom: 1,
        tool: "select",
        assets: [],
        history: [{ pages: book.pages, timestamp: Date.now() }],
        historyIndex: 0,
        isSaving: false,
        lastSaved: null,
      });
    },
  }))
);

// Selectors
export const selectCurrentPage = (state: EditorStore) =>
  state.book.pages.find((p) => p.id === state.currentPageId);

export const selectSelectedElement = (state: EditorStore) => {
  const page = selectCurrentPage(state);
  if (!page || !state.selectedElementId) return null;
  return page.elements.find((el) => el.id === state.selectedElementId) ?? null;
};

export const selectCanUndo = (state: EditorStore) => state.historyIndex > 0;
export const selectCanRedo = (state: EditorStore) =>
  state.historyIndex < state.history.length - 1;
