import { Character, Tier } from "../types";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";

interface TierRowProps {
  tier: Tier;
  characters: Character[];
  onRemove: (tier: Tier) => void;
}

export default function TierRow({ tier, characters, onRemove }: TierRowProps) {
  return (
    <div className="flex w-full items-center border rounded-lg">
      <div className="w-1/5 text-center font-bold text-xl py-4">
        {tier} <button onClick={() => onRemove(tier)}>❌</button>
      </div>
      <div className="w-4/5 p-4">
        <DropZone id={tier}>
          <div className="flex gap-2 flex-wrap">
            {characters.map((char) => (
              <DraggableCharacter key={char.id} id={char.id} image={char.image} />
            ))}
          </div>
        </DropZone>
      </div>
    </div>
  );
}