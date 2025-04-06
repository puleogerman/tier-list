import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

export function DraggableCharacter({ id, image }: { id: string; image: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-24 h-24 overflow-hidden flex items-center justify-center border rounded cursor-grab ${
        isDragging ? "scale-110 z-[999] shadow-lg" : ""
      }`}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
        transition: isDragging ? "none" : "transform 0.2s ease",
        position: "relative",
      }}
    >
      <Image
        alt="Character"
        src={image}
        width={100}
        height={100}
        className="w-full h-full object-cover rounded"
      />
    </div>
  );
}
