import { useDroppable } from "@dnd-kit/core";


export function DropZone({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });
  
    return (
      <div ref={setNodeRef} className="p-4 border rounded min-h-[100px] flex flex-wrap gap-2 bg-gray-100">
        {children}
      </div>
    );
  }