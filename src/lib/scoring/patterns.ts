import type { ParsedTile } from "./tiles";
import type { HandStructure } from "./win-check";

export interface PatternFlags {
  allPungs: boolean;
  allChows: boolean;
  halfFlush: boolean;
  fullFlush: boolean;
  allHonors: boolean;
  allSimples: boolean;
  dragonPungs: string[];
  windPungs: string[];
  pairIsDragon: boolean;
  pairIsWind: boolean;
  flowerCount: number;
  chowCount: number;
  pungCount: number;
}

export function analyzePatterns(
  tiles: ParsedTile[],
  structure: HandStructure
): PatternFlags {
  const suited = tiles.filter((t) => !t.isHonor && !t.isFlower);
  const honors = tiles.filter((t) => t.isHonor && !t.isFlower);
  const suits = new Set(suited.map((t) => t.suit));

  const melds = structure.melds;
  const chowCount = melds.filter((m) => m.type === "chow").length;
  const pungCount = melds.filter((m) => m.type === "pung").length;

  const dragonPungs = melds
    .filter((m) => m.type === "pung" && ["RD", "GD", "WD"].includes(m.tiles[0]))
    .map((m) => m.tiles[0]);

  const windPungs = melds
    .filter((m) => m.type === "pung" && ["E", "S", "W", "N"].includes(m.tiles[0]))
    .map((m) => m.tiles[0]);

  const pairId = structure.pair?.[0] ?? "";

  return {
    allPungs: chowCount === 0 && pungCount === 4,
    allChows: pungCount === 0 && chowCount === 4,
    halfFlush: honors.length > 0 && suits.size === 1 && suited.length > 0,
    fullFlush: honors.length === 0 && suits.size === 1 && suited.length === 14,
    allHonors: suited.length === 0 && honors.length === 14,
    allSimples: tiles.every(
      (t) => !t.isHonor && !t.isFlower && t.rank >= 2 && t.rank <= 8
    ),
    dragonPungs,
    windPungs,
    pairIsDragon: ["RD", "GD", "WD"].includes(pairId),
    pairIsWind: ["E", "S", "W", "N"].includes(pairId),
    flowerCount: tiles.filter((t) => t.isFlower).length,
    chowCount,
    pungCount,
  };
}
