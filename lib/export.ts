import type { Book } from "@/types";

export async function exportToPdf(book: Book): Promise<void> {
  // Dynamically import to avoid SSR issues
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [book.pages[0].width, book.pages[0].height],
  });

  // For each page, render a temporary canvas via Konva stage
  // We use the konva stage elements already rendered in the DOM
  const stages = document.querySelectorAll<HTMLCanvasElement>(
    ".konvajs-content canvas"
  );

  if (stages.length === 0) {
    alert(
      "Please open the editor with at least one page visible before exporting."
    );
    return;
  }

  for (let i = 0; i < stages.length; i++) {
    const canvas = stages[i];
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (i > 0) {
      pdf.addPage([book.pages[i]?.width ?? book.pages[0].width, book.pages[i]?.height ?? book.pages[0].height]);
    }
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      book.pages[i]?.width ?? book.pages[0].width,
      book.pages[i]?.height ?? book.pages[0].height
    );
  }

  pdf.save(`${book.title.replace(/\s+/g, "_")}.pdf`);
}
