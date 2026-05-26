import type { Metadata } from "next";
import BookPreview from "@/components/editor/BookPreview";

export const metadata: Metadata = {
  title: "Vista previa - Studio Álbum",
  description: "Previsualiza tu album de fotos como un pliego realista.",
};

export default function PreviewPage() {
  return <BookPreview />;
}
