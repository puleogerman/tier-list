"use client";
import { useState } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import ShareButton from "./ShareButton";
import { Character, Tier } from "../types";
import { defaultTiers, initialCharacters } from "../utils/constants";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";
import TierRow from "./TierRow";

const maxTiers = 8;
const minTiers = 3;

export default function TierList() {
  const [tiers, setTiers] = useState<Record<string, Character[]>>(
    Object.fromEntries(defaultTiers.map((tier) => [tier, []]))
  );
  const [characters, setCharacters] = useState(initialCharacters);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const characterId = active.id as string;

    if (!characterId) return;

    const movedCharacter = findCharacter(characterId);
    if (!movedCharacter) return;

    if (!over) {
      setCharacters((prev) => {
        if (!prev.some((character) => character.id === characterId)) {
          return [...prev, movedCharacter];
        }
        return prev;
      });
      return;
    }

    const destination = over.id as string;

    setTiers((prevTiers) => {
      let updatedTiers = { ...prevTiers };

      Object.keys(updatedTiers).forEach((tier) => {
        updatedTiers[tier] = updatedTiers[tier].filter(
          (char) => char.id !== characterId
        );
      });

      if (destination === "pool") {
        setCharacters((prev) => {
          if (!prev.some((char) => char.id === characterId)) {
            return [...prev, movedCharacter];
          }
          return prev;
        });
      } else if (destination in updatedTiers) {
        updatedTiers[destination] = [...updatedTiers[destination], movedCharacter];
        setCharacters((prev) => prev.filter((char) => char.id !== characterId));
      }

      return updatedTiers;
    });
  };

  const findCharacter = (id: string): Character | undefined => {
    return (
      characters.find((char) => char.id === id) ||
      Object.values(tiers).flat().find((char) => char.id === id)
    );
  };

  const addTier = () => {
    if (Object.keys(tiers).length >= maxTiers) return;
    const nextTier = String.fromCharCode(69 + Object.keys(tiers).length - 5); // 'E', 'F', 'G'
    setTiers((prev) => ({ ...prev, [nextTier]: [] }));
  };

  const removeTier = (tier: Tier) => {
    const existingTiers = Object.keys(tiers) as Tier[];
    if (existingTiers.length <= 3) return; // Prevent deleting too many tiers
  
    setTiers((prev) => {
      if (!prev[tier]) return prev; // Prevent double execution
  
      const updatedTiers = { ...prev };
      const removedCharacters = updatedTiers[tier]; // Get characters from deleted tier
      delete updatedTiers[tier]; // Remove the tier
  
      setCharacters((prevCharacters) => {
        // Avoid duplicates by filtering out characters that already exist
        const uniqueCharacters = removedCharacters.filter(
          (char) => !prevCharacters.some((c) => c.id === char.id)
        );
        return [...prevCharacters, ...uniqueCharacters];
      });
  
      return updatedTiers;
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Create Your Tier List</h2>

      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
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

        <div className="flex flex-col gap-2">
          {Object.entries(tiers).map(([tier, characters]) => (
            <TierRow key={tier} tier={tier as Tier} characters={characters} onRemove={removeTier} />
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


