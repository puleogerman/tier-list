import { useState } from "react";
import { TierData } from "../types";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";

interface TierRowProps {
  tier: TierData;
  onRemove: (tierName: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

export default function TierRow({ tier, onRemove, onRename }: TierRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(tier.name);

  const handleRename = () => {
    if (newName.trim() && newName !== tier.name) {
      onRename(tier.name, newName);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex w-full items-center border rounded-lg">
      {/* Tier Name (Editable) */}
      <div className="w-1/6 text-center font-bold text-xl py-4 cursor-pointer">
        {isEditing ? (
          <input
            type="text"
            className="border rounded p-1 w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditing(true)}>{tier.name}</span>
        )}
      </div>

      {/* Character DropZone */}
      <div className="w-4/6 p-4">
        <DropZone id={tier.name}>
          <div className="flex gap-2 flex-wrap">
            {tier.characters.map((char) => (
              <DraggableCharacter key={char.id} id={char.id} image={char.image} />
            ))}
          </div>
        </DropZone>
      </div>

      {/* Delete Tier Button */}
      <div className="w-1/6 text-center py-4">
        <button
          onClick={() => onRemove(tier.name)}
          className="text-red-500 hover:text-red-700 text-lg"
          aria-label="Remove Tier"
        >
          ❌
        </button>
      </div>
    </div>
  );
}