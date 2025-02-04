"use client";
import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import ShareButton from "./ShareButton";
import Image from "next/image";

type Tier = "S" | "A" | "B" | "C" | "D"; // Define valid tier names

type Character = {
  id: string;
  name: string;
  image: string;
};

const initialCharacters: Character[] = [
  { id: "1", name: "Mario", image: "/images/mario.png" },
  { id: "2", name: "Pikachu", image: "/images/pikachu.png" },
  { id: "3", name: "Sonic", image: "/images/sonic.png" },
];

const initialTiers: Record<Tier, Character[]> = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
};

export default function TierList() {
  const [tiers, setTiers] = useState(initialTiers);
  const [characters, setCharacters] = useState(initialCharacters);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const characterId = active.id as string;
  
    if (!characterId) return;
  
    // Find where the character currently is
    const movedCharacter = findCharacter(characterId);
  
    if (!movedCharacter) return; // Ensure character exists before proceeding
  
    if (!over) {
      // If dropped outside any valid drop zone, return it to the pool
      setCharacters((prev) => {
        if (!prev.some((char) => char.id === characterId)) {
          return [...prev, movedCharacter];
        }
        return prev;
      });
      return;
    }
  
    const destination = over.id as Tier | "pool";
  
    setTiers((prevTiers) => {
      let updatedTiers = { ...prevTiers };
  
      // Remove character from any tier it was in
      Object.keys(updatedTiers).forEach((tier) => {
        updatedTiers[tier as Tier] = updatedTiers[tier as Tier].filter((char) => char.id !== characterId);
      });
  
      if (destination === "pool") {
        // Move character back to the pool
        setCharacters((prev) => {
          if (!prev.some((char) => char.id === characterId)) {
            return [...prev, movedCharacter];
          }
          return prev;
        });
      } else if (destination in updatedTiers) {
        // Move character into a specific tier
        updatedTiers[destination] = [...updatedTiers[destination], movedCharacter];
  
        // Remove from pool
        setCharacters((prev) => prev.filter((char) => char.id !== characterId));
      }
  
      return updatedTiers;
    });
  };
  
  // Helper function to find a character in either pool or tiers
  const findCharacter = (id: string): Character | undefined => {
    return (
      characters.find((char) => char.id === id) ||
      Object.values(tiers).flat().find((char) => char.id === id)
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Create Your Tier List</h2>

      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        {/* Character Pool */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">Character Pool</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <DropZone id="pool">
              {characters.map((char) => (
                <DraggableCharacter key={char.id} id={char.id} image={char.image} />
              ))}
            </DropZone>
          </div>
        </div>

        {/* Tiers - Displayed as rows */}
        <div className="flex flex-col gap-2">
          {Object.entries(tiers).map(([tier, characters]) => {
            const typedTier = tier as Tier;
            return (
              <div key={typedTier} className="flex w-full items-center border rounded-lg ">
                {/* Tier Label - Left 20% */}
                <div className="w-1/5 text-center font-bold text-xl py-4">{typedTier}</div>

                {/* Drop Zone - Right 80% */}
                <div className="w-4/5 p-4 ">
                  <DropZone id={typedTier}>
                    <div className="flex gap-2 flex-wrap">
                      {characters.map((char) => (
                        <DraggableCharacter key={char.id} id={char.id} image={char.image} />
                      ))}
                    </div>
                  </DropZone>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Share Button */}
      <div className="mt-6 flex justify-center">
        <ShareButton tierListId="example-tierlist-id" />
      </div>
    </div>
  );
}

// Component for draggable characters
function DraggableCharacter({ id, image }: { id: string; image: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <Image
    alt="Character"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={image}
      width={100}
      height={60}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
    />
  );
}

function DropZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="p-4 border rounded min-h-[100px] flex flex-wrap gap-2 bg-gray-100"
    >
      {children}
    </div>
  );
}


