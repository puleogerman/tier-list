export type Tier = "S" | "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type Character = {
  id: string;
  name: string;
  image: string;
};

export type TierData = {
  name: string;
  characters: Character[];
}