import {
  cloneCounts,
  countTiles,
  isSuited,
  parseTile,
  parseTiles,
  sortedTileKeys,
  totalCount,
  type ParsedTile,
} from "./tiles";

export interface Meld {
  type: "chow" | "pung" | "pair";
  tiles: string[];
}

export interface HandStructure {
  isValid: boolean;
  melds: Meld[];
  pair: string[] | null;
}

function firstKey(counts: Map<string, number>): string | null {
  for (const key of sortedTileKeys(counts)) {
    if ((counts.get(key) ?? 0) > 0) return key;
  }
  return null;
}

function allZero(counts: Map<string, number>): boolean {
  for (const v of counts.values()) {
    if (v > 0) return false;
  }
  return true;
}

function subtract(
  counts: Map<string, number>,
  id: string,
  n: number
): Map<string, number> | null {
  const next = cloneCounts(counts);
  const current = next.get(id) ?? 0;
  if (current < n) return null;
  next.set(id, current - n);
  if (next.get(id) === 0) next.delete(id);
  return next;
}

function tryChow(counts: Map<string, number>, id: string): Map<string, number> | null {
  const tile = parseTile(id);
  if (!tile || tile.isHonor) return null;

  const suit = tile.suit;
  const r2 = `${tile.rank + 1}${suit}`;
  const r3 = `${tile.rank + 2}${suit}`;
  if (tile.rank > 7) return null;
  if ((counts.get(r2) ?? 0) === 0 || (counts.get(r3) ?? 0) === 0) return null;

  let next = subtract(counts, id, 1);
  next = next && subtract(next, r2, 1);
  next = next && subtract(next, r3, 1);
  return next;
}

function canFormMelds(counts: Map<string, number>, meldsNeeded: number): boolean {
  if (meldsNeeded === 0) return allZero(counts);

  const key = firstKey(counts);
  if (!key) return meldsNeeded === 0;

  const count = counts.get(key) ?? 0;

  if (count >= 3) {
    const afterPung = subtract(counts, key, 3);
    if (afterPung && canFormMelds(afterPung, meldsNeeded - 1)) return true;
  }

  if (isSuited(key)) {
    const afterChow = tryChow(counts, key);
    if (afterChow && canFormMelds(afterChow, meldsNeeded - 1)) return true;
  }

  return false;
}

export function isStandardWin(tiles: ParsedTile[]): boolean {
  const counts = countTiles(tiles);
  if (totalCount(counts) !== 14) return false;

  for (const key of counts.keys()) {
    if ((counts.get(key) ?? 0) >= 2) {
      const afterPair = subtract(counts, key, 2);
      if (afterPair && canFormMelds(afterPair, 4)) return true;
    }
  }

  return false;
}

function buildMelds(counts: Map<string, number>, meldsNeeded: number): Meld[] | null {
  if (meldsNeeded === 0) return allZero(counts) ? [] : null;

  const key = firstKey(counts);
  if (!key) return meldsNeeded === 0 ? [] : null;

  const count = counts.get(key) ?? 0;

  if (count >= 3) {
    const afterPung = subtract(counts, key, 3);
    const rest = afterPung && buildMelds(afterPung, meldsNeeded - 1);
    if (rest) {
      return [{ type: "pung", tiles: [key, key, key] }, ...rest];
    }
  }

  if (isSuited(key)) {
    const tile = parseTile(key)!;
    const r2 = `${tile.rank + 1}${tile.suit}`;
    const r3 = `${tile.rank + 2}${tile.suit}`;
    const afterChow = tryChow(counts, key);
    const rest = afterChow && buildMelds(afterChow, meldsNeeded - 1);
    if (rest) {
      return [{ type: "chow", tiles: [key, r2, r3] }, ...rest];
    }
  }

  return null;
}

export function decomposeHand(tiles: ParsedTile[]): HandStructure {
  const counts = countTiles(tiles);

  if (totalCount(counts) !== 14) {
    return { isValid: false, melds: [], pair: null };
  }

  for (const key of counts.keys()) {
    if ((counts.get(key) ?? 0) >= 2) {
      const afterPair = subtract(counts, key, 2);
      const melds = afterPair && buildMelds(afterPair, 4);
      if (melds) {
        return { isValid: true, melds, pair: [key, key] };
      }
    }
  }

  return { isValid: false, melds: [], pair: null };
}

export function validateTileInput(raw: string[]): {
  tiles: ParsedTile[];
  invalid: string[];
  countErrors: string[];
} {
  const { tiles, invalid } = parseTiles(raw);
  const counts = countTiles(tiles);
  const countErrors: string[] = [];

  for (const [id, count] of counts) {
    if (count > 4) countErrors.push(`${id} appears ${count} times (max 4).`);
  }

  return { tiles, invalid, countErrors };
}
