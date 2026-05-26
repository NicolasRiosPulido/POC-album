import type { Metadata } from "next";
import BookPreview from "@/components/editor/BookPreview";

export const metadata: Metadata = {
  title: "Preview - Studio Álbum",
  description: "Preview your photo book as a realistic spread.",
};

export default function PreviewPage() {
  return <BookPreview />;
}
