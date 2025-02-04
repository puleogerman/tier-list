import { Character } from "../types";

export const initialCharacters: Character[] = [
  { id: "1", name: "Mario", image: "/images/mario.png" },
  { id: "2", name: "Pikachu", image: "/images/pikachu.png" },
  { id: "3", name: "Sonic", image: "/images/sonic.png" },
  { id: "4", name: "Cloud", image: "/images/cloud_chocobo.jpg" },
  { id: "5", name: "Lara", image: "/images/lara_croft.png" },
  { id: "6", name: "Link", image: "/images/link_bow.png" },
];

export const defaultTiers = ["S", "A", "B", "C", "D"];

// export const initialTiers: Record<Tier, Character[]> = {
//     S: [],
//     A: [],
//     B: [],
//     C: [],
//     D: [],
//     E: [],
//     F: [],
//     G: []
// };