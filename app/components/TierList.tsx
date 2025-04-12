"use client";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TierRow from "./TierRow";
import CharacterPool from "./CharacterPool";
import useTierList from "../hook/useTierList";
import ShareButton from "./ShareButton";
import { useState } from "react";

export default function TierList() {
  const {
    tiers,
    characters,
    setTiers,
    setCharacters,
    onDragEnd,
    addTier,
    removeTier,
    renameTier,
  } = useTierList();

  const [tierListTitle, setTierListTitle] = useState("My TierList");

  return (
    <div className="px-4">
      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>

        <div className="character-pool-container box-border px-8 py-2">
          <CharacterPool
            characters={characters}
            setCharacters={setCharacters}
          />

        </div>

        <div id="tier-list-container" className="m-2 box-border p-8">
          {/* Tier List Title */}
          <div className="mb-4 text-center">
            <input
              type="text"
              value={tierListTitle}
              onChange={(e) => setTierListTitle(e.target.value)}
              className="text-2xl font-bold text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(tiers).map(([tierName, tierCharacters], index) => (
              <TierRow
                key={tierName}
                tier={{ name: tierName, characters: tierCharacters }}
                index={index}
                onRemove={removeTier}
                onRename={renameTier}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {/* <div className="mt-4 flex justify-between">
        <button
          className="button-distorted"
          onClick={addTier}
          disabled={Object.keys(tiers).length >= 8}
        >
          Add Tier
        </button>
      </div> */}
      <div className="mt-6 flex justify-center">
        <ShareButton tierListId="example-tier-list"></ShareButton>
      </div>
    </div>
  );
}
