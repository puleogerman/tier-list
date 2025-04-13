// DropZone.tsx
import { useDroppable } from "@dnd-kit/core";

export function DropZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={`p-2 rounded min-h-[100px] flex flex-wrap gap-2 ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
      style={{ width: "100%", zIndex: 1 }}
    >
      {children}
    </div>
  );
}