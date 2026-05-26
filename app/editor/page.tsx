import type { Metadata } from "next";
import BookEditor from "@/components/editor/BookEditor";

export const metadata: Metadata = {
  title: "Editor — Studio Álbum",
  description: "Crea y disena tu album de fotos",
};

export default function EditorPage() {
  return <BookEditor />;
}
