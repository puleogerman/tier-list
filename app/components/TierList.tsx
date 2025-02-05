"use client";
import { useState } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import ShareButton from "./ShareButton";
import { Character, Tier, TierData } from "../types";
import { defaultTiers, initialCharacters } from "../utils/constants";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";
import TierRow from "./TierRow";

const maxTiers = 8;
const minTiers = 3;

export default function TierList() {
  const [tiers, setTiers] = useState<TierData[]>(
    defaultTiers.map((name) => ({ name, characters: [] }))
  );
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [editingTier, setEditingTier] = useState<string | null>(null);

  const findCharacter = (id: string): Character | undefined => {
    return (
      characters.find((char) => char.id === id) ||
      tiers.flatMap((tier) => tier.characters).find((char) => char.id === id)
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const characterId = active.id as string;
    if (!characterId) return;

    const movedCharacter = findCharacter(characterId);
    if (!movedCharacter) return;

    if (!over) {
      setCharacters((prev) =>
        prev.some((char) => char.id === characterId)
          ? prev
          : [...prev, movedCharacter]
      );
      return;
    }

    const destination = over.id as string;
    setTiers((prevTiers) => {
      return prevTiers.map((tier) => ({
        ...tier,
        characters: tier.characters.filter((char) => char.id !== characterId),
      }));
    });

    if (destination === "pool") {
      setCharacters((prev) =>
        prev.some((char) => char.id === characterId)
          ? prev
          : [...prev, movedCharacter]
      );
    } else {
      setTiers((prevTiers) =>
        prevTiers.map((tier) =>
          tier.name === destination
            ? { ...tier, characters: [...tier.characters, movedCharacter] }
            : tier
        )
      );
      setCharacters((prev) => prev.filter((char) => char.id !== characterId));
    }
  };

  const addTier = () => {
    if (tiers.length >= maxTiers) return;

    const nextTierName = String.fromCharCode(69 + tiers.length - 5); // 'E', 'F', 'G'
    setTiers((prev) => [...prev, { name: nextTierName, characters: [] }]);
  };

  const updateTierName = (oldName: string, newName: string) => {
    if (!newName.trim() || tiers.some((tier) => tier.name === newName)) return;
    setTiers((prevTiers) =>
      prevTiers.map((tier) =>
        tier.name === oldName ? { ...tier, name: newName } : tier
      )
    );
    setEditingTier(null);
  };

  const removeTier = (tierName: string) => {
    if (tiers.length <= minTiers) return;

    setTiers((prevTiers) => {
      const removedTier = prevTiers.find((tier) => tier.name === tierName);
      if (!removedTier) return prevTiers;

      setCharacters((prevCharacters) => [
        ...prevCharacters,
        ...removedTier.characters.filter(
          (char) => !prevCharacters.some((c) => c.id === char.id)
        ),
      ]);

      return prevTiers.filter((tier) => tier.name !== tierName);
    });
  };

  return (
    <div className="p-4">
      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Character Pool
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <DropZone id="pool">
              {characters.map((char) => (
                <DraggableCharacter
                  key={char.id}
                  id={char.id}
                  image={char.image}
                />
              ))}
            </DropZone>
          </div>
        </div>

        <div id="tier-list-container" className="flex flex-col gap-2">
          {tiers.map((tier) => (
            <TierRow
              key={tier.name}
              tier={tier}
              onRemove={removeTier}
              onRename={updateTierName}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={addTier}
          disabled={Object.keys(tiers).length >= maxTiers}
        >
          Add Tier
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <ShareButton tierListId="example-tierlist-id" />
      </div>
    </div>
  );
}
