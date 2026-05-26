import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor — Studio Álbum",
  description: "Disena tu album de fotos",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
