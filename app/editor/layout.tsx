import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor — Studio Álbum",
  description: "Design your photo book",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
