import { useState } from "react";
import { DropZone } from "./DropZone";
import { DraggableCharacter } from "./DraggableCharacter";
import { Character } from "../types";

interface CharacterPoolProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}

// Extend input props to include directory attributes
interface ExtendedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
  mozdirectory?: string;
}

export default function CharacterPool({
  characters,
  setCharacters,
}: CharacterPoolProps) {
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFolderInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    setUploadError(null);
    
    if (event.dataTransfer.items) {
      const items = event.dataTransfer.items;
      let allFiles: File[] = [];
      
      // Process each item sequentially
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            try {
              const files = await getFilesFromEntry(entry);
              allFiles = [...allFiles, ...files];
            } catch (error) {
              console.error("Error processing entry:", error);
            }
          }
        }
      }
      
      if (allFiles.length > 0) {
        processFiles(allFiles);
      } else {
        setUploadError("No valid files found in the dropped items.");
      }
    } else if (event.dataTransfer.files) {
      processFiles(Array.from(event.dataTransfer.files));
    }
  };

  const getFilesFromEntry = async (entry: any): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise<File[]>((resolve) => {
        entry.file((file: File) => resolve([file]));
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const files: File[] = [];
      
      return new Promise<File[]>((resolve) => {
        const readEntries = () => {
          dirReader.readEntries(async (entries: any[]) => {
            if (entries.length === 0) {
              resolve(files);
              return;
            }
            
            for (const subEntry of entries) {
              const subFiles = await getFilesFromEntry(subEntry);
              files.push(...subFiles);
            }
            
            readEntries();
          });
        };
        
        readEntries();
      });
    }
    return [];
  };

  const processFiles = (files: File[]) => {
    setIsProcessing(true);
    setUploadError(null);
    
    const imageFiles = files.filter((file) =>
      ["image/png", "image/jpeg", "image/webp"].includes(file.type)
    );

    if (imageFiles.length === 0) {
      setUploadError("No valid images found. Please upload PNG, JPEG, or WebP files.");
      setIsProcessing(false);
      return;
    }

    const newCharacters = imageFiles.map((file, index) => ({
      id: `custom-${Date.now()}-${index}`,
      name: file.name.split('.')[0] || "custom-character",
      image: URL.createObjectURL(file),
    }));

    setCharacters((prev) => [...prev, ...newCharacters]);
    setIsProcessing(false);
  };

  return (
    <div
      className={`w-full pr-4 border p-4 rounded-lg ${
        dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
      } relative`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold mb-2 text-center">Character Pool</h3>

      {/* Upload Section */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex gap-4">
          {/* Folder Upload */}
          <div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              id="fileInput"
              onChange={handleFolderInput}
              multiple
              {...{
                webkitdirectory: "",
                directory: "",
                mozdirectory: "",
              } as ExtendedInputProps}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              {isProcessing ? "Processing..." : "Upload Folder"}
            </label>
          </div>
          
          {/* Single File Upload (fallback) */}
          <div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              id="singleFileInput"
              onChange={handleFolderInput}
              multiple
            />
            <label
              htmlFor="singleFileInput"
              className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              {isProcessing ? "Processing..." : "Upload Files"}
            </label>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">Drag & drop a folder or click to upload</p>
        
        {/* Error Message */}
        {uploadError && (
          <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
            {uploadError}
          </div>
        )}
      </div>

      {/* Character Pool Display */}
      <div className="flex flex-wrap justify-center gap-2">
        <DropZone id="pool">
          {characters?.length > 0 && characters?.map((char) => (
            <DraggableCharacter key={char.id} id={char.id} image={char.image} />
          ))}
        </DropZone>
      </div>
    </div>
  );
}