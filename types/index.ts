export type ElementType = "image" | "text" | "shape";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  name: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  align: "left" | "center" | "right";
}

export type CanvasElement = ImageElement | TextElement;

export interface Page {
  id: string;
  name: string;
  elements: CanvasElement[];
  background: string;
  width: number;
  height: number;
}

export interface Book {
  id: string;
  title: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  coverPageId: string | null;
}

export interface UploadedAsset {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  size: number;
  type: string;
}

export interface HistoryEntry {
  pages: Page[];
  timestamp: number;
}

export type Tool = "select" | "text" | "image" | "hand";

export interface EditorState {
  book: Book;
  currentPageId: string;
  selectedElementId: string | null;
  zoom: number;
  tool: Tool;
  assets: UploadedAsset[];
  history: HistoryEntry[];
  historyIndex: number;
  isSaving: boolean;
  lastSaved: string | null;
}
