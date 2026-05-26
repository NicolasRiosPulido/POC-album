"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
  Rect,
} from "react-konva";
import Konva from "konva";
import {
  useEditorStore,
  selectCurrentPage,
} from "@/store/editorStore";
import type { CanvasElement, ImageElement, TextElement } from "@/types";

interface CanvasPageProps {
  pageId: string;
}

function ImageNode({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: {
  element: ImageElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ImageElement>) => void;
}) {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = element.src;
    img.onload = () => setImage(img);
  }, [element.src]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!image) return null;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onUpdate({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onUpdate({
            x: node.x(),
            y: node.y(),
            width: Math.max(10, node.width() * scaleX),
            height: Math.max(10, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

function TextNode({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: {
  element: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextElement>) => void;
}) {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        text={element.content}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fontStyle={`${element.fontStyle} ${element.fontWeight}`}
        fill={element.color}
        align={element.align}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onUpdate({ x: e.target.x(), y: e.target.y() });
        }}
        onDblClick={() => {
          // Handled via properties panel for now
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          onUpdate({
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            "middle-left",
            "middle-right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default function CanvasPage({ pageId }: CanvasPageProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const {
    book,
    selectedElementId,
    selectElement,
    updateElement,
    tool,
    addElement,
    zoom,
  } = useEditorStore();

  const page = book.pages.find((p) => p.id === pageId);
  if (!page) return null;

  const sortedElements = [...page.elements].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage() || e.target instanceof Konva.Rect) {
        selectElement(null);

        if (tool === "text") {
          const pos = e.target.getStage()?.getRelativePointerPosition();
          if (!pos) return;
          const newText: TextElement = {
            id: crypto.randomUUID(),
            type: "text",
            x: pos.x,
            y: pos.y,
            width: 200,
            height: 50,
            rotation: 0,
            zIndex: page.elements.length,
            opacity: 1,
            content: "Double-click to edit",
            fontSize: 24,
            fontFamily: "Inter, sans-serif",
            fontWeight: "400",
            fontStyle: "normal",
            color: "#0F172A",
            align: "left",
          };
          addElement(pageId, newText);
        }
      }
    },
    [tool, pageId, page.elements.length, addElement, selectElement]
  );

  return (
    <Stage
      ref={stageRef}
      width={page.width * zoom}
      height={page.height * zoom}
      scaleX={zoom}
      scaleY={zoom}
      onClick={handleStageClick}
      style={{
        boxShadow: "0 4px 40px rgba(0,0,0,0.18)",
        borderRadius: 4,
        background: page.background,
        cursor: tool === "text" ? "text" : tool === "hand" ? "grab" : "default",
      }}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={page.width}
          height={page.height}
          fill={page.background}
        />
        {sortedElements.map((element: CanvasElement) =>
          element.type === "image" ? (
            <ImageNode
              key={element.id}
              element={element as ImageElement}
              isSelected={selectedElementId === element.id}
              onSelect={() => selectElement(element.id)}
              onUpdate={(updates) =>
                updateElement(pageId, element.id, updates)
              }
            />
          ) : (
            <TextNode
              key={element.id}
              element={element as TextElement}
              isSelected={selectedElementId === element.id}
              onSelect={() => selectElement(element.id)}
              onUpdate={(updates) =>
                updateElement(pageId, element.id, updates)
              }
            />
          )
        )}
      </Layer>
    </Stage>
  );
}
