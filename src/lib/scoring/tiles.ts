import { TILE_BY_ID } from "../mahjong";

export type Suit = "m" | "s" | "p" | "honor";

export interface ParsedTile {
  id: string;
  suit: Suit;
  /** 1–9 for suited tiles; honor code for honors */
  rank: number;
  isHonor: boolean;
  isFlower: boolean;
}

const HONOR_RANK: Record<string, number> = {
  E: 1,
  S: 2,
  W: 3,
  N: 4,
  RD: 5,
  GD: 6,
  WD: 7,
  F: 8,
  SP: 9,
};

export function normalizeTileId(raw: string): string | null {
  const id = raw.trim().toUpperCase();
  if (TILE_BY_ID[id]) return id;

  const suited = id.match(/^([1-9])([MSP])$/);
  if (suited) {
    const suit = suited[2] === "M" ? "m" : suited[2] === "S" ? "s" : "p";
    return `${suited[1]}${suit}`;
  }

  return null;
}

export function parseTile(id: string): ParsedTile | null {
  const normalized = normalizeTileId(id);
  if (!normalized) return null;

  const def = TILE_BY_ID[normalized];
  if (!def) return null;

  if (def.category === "flowers") {
    return {
      id: normalized,
      suit: "honor",
      rank: HONOR_RANK[normalized] ?? 0,
      isHonor: true,
      isFlower: true,
    };
  }

  if (def.category === "winds" || def.category === "dragons") {
    return {
      id: normalized,
      suit: "honor",
      rank: HONOR_RANK[normalized] ?? 0,
      isHonor: true,
      isFlower: false,
    };
  }

  const match = normalized.match(/^([1-9])([msp])$/);
  if (!match) return null;

  return {
    id: normalized,
    suit: match[2] as Suit,
    rank: Number(match[1]),
    isHonor: false,
    isFlower: false,
  };
}

export function parseTiles(raw: string[]): {
  tiles: ParsedTile[];
  invalid: string[];
} {
  const tiles: ParsedTile[] = [];
  const invalid: string[] = [];

  for (const rawId of raw) {
    const tile = parseTile(rawId);
    if (tile) tiles.push(tile);
    else invalid.push(rawId);
  }

  return { tiles, invalid };
}

export function countTiles(tiles: ParsedTile[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tile of tiles) {
    counts.set(tile.id, (counts.get(tile.id) ?? 0) + 1);
  }
  return counts;
}

export function totalCount(counts: Map<string, number>): number {
  let n = 0;
  for (const v of counts.values()) n += v;
  return n;
}

export function cloneCounts(
  counts: Map<string, number>
): Map<string, number> {
  return new Map(counts);
}

export function sortedTileKeys(counts: Map<string, number>): string[] {
  return [...counts.keys()].sort((a, b) => {
    const ta = parseTile(a);
    const tb = parseTile(b);
    if (!ta || !tb) return a.localeCompare(b);
    if (ta.suit !== tb.suit) return ta.suit.localeCompare(tb.suit);
    return ta.rank - tb.rank;
  });
}

export function isSuited(id: string): boolean {
  const tile = parseTile(id);
  return !!tile && !tile.isHonor && !tile.isFlower;
}

export function suitOf(id: string): Suit | null {
  const tile = parseTile(id);
  return tile?.isHonor || tile?.isFlower ? null : tile?.suit ?? null;
}

export function hasInvalidCounts(counts: Map<string, number>): string[] {
  const errors: string[] = [];
  for (const [id, count] of counts) {
    if (count > 4) errors.push(`${id} appears ${count} times (max 4).`);
  }
  return errors;
}
