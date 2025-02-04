import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

export function DraggableCharacter({ id, image }: { id: string; image: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  
    return (
      <Image
        alt="Character"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        src={image}
        width={100}
        height={100}
        style={{
          transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
        }}
      />
    );
  }