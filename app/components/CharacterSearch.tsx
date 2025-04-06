import { useState } from "react";

export default function CharacterSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-1/2 pl-4 border-l">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Search Characters
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a character..."
          className="border p-2 w-full rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {/* Here we display the images */}
      </div>
    </div>
  );
}
