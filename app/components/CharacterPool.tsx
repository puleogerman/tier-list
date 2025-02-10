import { useState } from "react";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";
import { Character } from "../types";

interface CharacterPoolProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}

export default function CharacterPool({
  characters,
  setCharacters,
}: CharacterPoolProps) {
  const [dragging, setDragging] = useState(false);

  // Handles file input when the user selects a file
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) processFiles(files);
  };

  // Handles file drop when the user drags and drops an image
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files) {
      processFiles(event.dataTransfer.files);
    }
  };

  // Extracts file URLs and adds them to the character pool
  const processFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      ["image/png", "image/jpeg", "image/webp"].includes(file.type)
    );

    const newCharacters = imageFiles.map((file, index) => ({
      id: `custom-${Date.now()}-${index}`,
      name: "custom-character",
      image: URL.createObjectURL(file), // Generates a local URL
    }));

    setCharacters((prev) => [...prev, ...newCharacters]);
  };

  return (
    <div
      className={`w-1/2 pr-4 border p-4 rounded-lg ${
        dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold mb-2 text-center">Character Pool</h3>

      {/* File Upload Section */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          id="fileInput"
          onChange={handleFileInput}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Upload Image
        </label>
        <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
      </div>

      {/* Character Pool Display */}
      <div className="flex flex-wrap justify-center gap-2">
        <DropZone id="pool">
          {characters.map((char) => (
            <DraggableCharacter key={char.id} id={char.id} image={char.image} />
          ))}
        </DropZone>
      </div>
    </div>
  );
}
