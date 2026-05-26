import type { Metadata } from "next";
import BookEditor from "@/components/editor/BookEditor";

export const metadata: Metadata = {
  title: "Editor — Studio Álbum",
  description: "Create and design your photo book",
};

export default function EditorPage() {
  return <BookEditor />;
}
