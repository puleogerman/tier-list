import { Character } from "../types";
import { defaultTiers, initialCharacters } from "../utils/constants";
import { DragEndEvent } from "@dnd-kit/core";
import { useSessionStorage } from "./useSessionStorage";

const maxTiers = 8;
const minTiers = 3;

type TierMap = Record<string, Character[]>;

export default function useTierList() {
    const [tiers, setTiers] = useSessionStorage<TierMap>(
        "tierList-tiers",
        Object.fromEntries(defaultTiers.map((tier) => [tier, []]))
    );

    const [characters, setCharacters] = useSessionStorage<Character[]>(
        "tierList-characters",
        initialCharacters
    );

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const characterId = active.id as string;

        if (!characterId) return;

        const movedCharacter = findCharacter(characterId);
        if (!movedCharacter) return;

        if (!over) {
            setCharacters((prev: Character[]) => {
                if (!prev.some((character) => character.id === characterId)) {
                    return [...prev, movedCharacter];
                }
                return prev;
            });
            return;
        }

        const destination = over.id as string;

        setTiers((prevTiers: TierMap) => {
            const updatedTiers: TierMap = { ...prevTiers };

            Object.keys(updatedTiers).forEach((tier) => {
                updatedTiers[tier] = updatedTiers[tier].filter(
                    (char) => char.id !== characterId
                );
            });

            if (destination === "pool") {
                setCharacters((prev: Character[]) => {
                    if (!prev.some((char) => char.id === characterId)) {
                        return [...prev, movedCharacter];
                    }
                    return prev;
                });
            } else if (destination in updatedTiers) {
                updatedTiers[destination] = [...updatedTiers[destination], movedCharacter];
                setCharacters((prev: Character[]) => 
                    prev.filter((char) => char.id !== characterId)
                );
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
        const nextTier = String.fromCharCode(69 + Object.keys(tiers).length - 5);
        setTiers((prev: TierMap) => ({ ...prev, [nextTier]: [] }));
    };

    const removeTier = (tier: string) => {
        if (Object.keys(tiers).length <= minTiers) return;
        setTiers((prev: TierMap) => {
            const updatedTiers = { ...prev };
            delete updatedTiers[tier];
            return updatedTiers;
        });
    };

    const renameTier = (oldName: string, newName: string) => {
      setTiers(prev => {
        const updated = {...prev};
        updated[newName] = updated[oldName];
        delete updated[oldName];
        return updated;
      });
    };

    const resetTierList = () => {
        setTiers(Object.fromEntries(defaultTiers.map((tier) => [tier, []])));
        setCharacters([]);
    };

    return { 
        tiers, 
        characters, 
        setTiers, 
        setCharacters, 
        onDragEnd, 
        addTier, 
        removeTier,
        renameTier,
        resetTierList 
    };
}