import { useState } from "react";
import { Character } from "../types";
import { defaultTiers, initialCharacters } from "../utils/constants";
import { DragEndEvent } from "@dnd-kit/core";

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
  
    const removeTier = (tier: string) => {
      if (Object.keys(tiers).length <= minTiers) return;
      setTiers((prev) => {
        const updatedTiers = { ...prev };
        delete updatedTiers[tier];
        return updatedTiers;
      });
    };

    return { tiers, characters, setTiers, setCharacters, onDragEnd, addTier, removeTier };
}