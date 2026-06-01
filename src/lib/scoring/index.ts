import type { MahjongRuleSet, ScoreResult } from "../mahjong";
import {
  buildBonusesForRule,
  faanTotal,
  fanTotal,
  hanTotal,
  ltcTotal,
  minToWin,
  sumCountedValue,
  taiTotal,
} from "./bonus-hints";
import { analyzePatterns } from "./patterns";
import { decomposeHand, validateTileInput } from "./win-check";
import type { ParsedTile } from "./tiles";

function formatTotal(ruleSet: MahjongRuleSet, bonuses: ReturnType<typeof buildBonusesForRule>): string {
  switch (ruleSet) {
    case "hong-kong":
    case "singaporean":
      return faanTotal(bonuses);
    case "riichi":
      return hanTotal(bonuses);
    case "taiwanese":
      return taiTotal(bonuses);
    case "chinese-official":
      return fanTotal(bonuses);
    default:
      return ltcTotal(bonuses);
  }
}

function scoreValidHand(
  ruleSet: MahjongRuleSet,
  tiles: ParsedTile[],
  structure: ReturnType<typeof decomposeHand>
): ScoreResult {
  const patterns = analyzePatterns(tiles, structure);
  const bonuses = buildBonusesForRule(ruleSet, patterns);
  const total = sumCountedValue(bonuses);
  const totalPoints = formatTotal(ruleSet, bonuses);

  const ruleNotes: Record<MahjongRuleSet, string[]> = {
    "american-nmjl": [],
    "hong-kong": [
      "Minimum 3 faan usually required to win under Hong Kong Old Style.",
    ],
    "ltc-house": [
      "LTC house rules are simplified for learning. Confirm with your table coach.",
    ],
    riichi: [
      "Fu, dora, and ura-dora are not included in this simplified scorer.",
    ],
    taiwanese: [
      "Full Taiwanese rules use 16-tile hands and more tai patterns.",
      "Minimum 5 tai is common to win.",
    ],
    "chinese-official": [
      "Full MCR has 81 scoring patterns. This covers common open-hand fan.",
    ],
    singaporean: [
      "Singaporean scoring is similar to Hong Kong with local variations.",
    ],
  };

  return {
    totalPoints,
    isValidHand: structure.isValid && minToWin(ruleSet, total),
    handDescription: structure.isValid
      ? `Your hand scores ${totalPoints} from tile patterns. Add any conditional bonuses below if they apply.`
      : "This does not form a valid 14-tile winning hand (4 sets + 1 pair).",
    bonuses,
    notes: ruleNotes[ruleSet] ?? [],
    confidence: "high",
  };
}

function scoreAmerican(): ScoreResult {
  return {
    totalPoints: "N/A",
    isValidHand: false,
    handDescription:
      "American Mahjong (NMJL) uses the annual score card — pattern matching cannot be done from tiles alone.",
    bonuses: [],
    notes: [
      "Compare your hand to the current NMJL card to find a matching line.",
      "Use tile entry to verify you have 14 tiles in valid groups.",
    ],
    confidence: "high",
  };
}

export function calculateHandScore(
  rawTiles: string[],
  ruleSet: MahjongRuleSet
): ScoreResult {
  const { tiles, invalid, countErrors } = validateTileInput(rawTiles);

  if (invalid.length > 0) {
    return {
      totalPoints: "—",
      isValidHand: false,
      handDescription: "Some tiles could not be recognized.",
      bonuses: [],
      notes: [`Unknown tiles: ${invalid.join(", ")}`],
      confidence: "high",
    };
  }

  if (countErrors.length > 0) {
    return {
      totalPoints: "—",
      isValidHand: false,
      handDescription: "Invalid tile counts.",
      bonuses: [],
      notes: countErrors,
      confidence: "high",
    };
  }

  const flowers = tiles.filter((t) => t.isFlower);
  const playingTiles = tiles.filter((t) => !t.isFlower);
  const flowerNote =
    flowers.length > 0
      ? `Flower/season tiles (${flowers.map((t) => t.id).join(", ")}) scored separately — not included in the 14-tile hand.`
      : null;

  if (ruleSet === "american-nmjl") {
    if (playingTiles.length !== 14) {
      return {
        ...scoreAmerican(),
        notes: [
          `American hands use 14 tiles; you have ${playingTiles.length} (excluding ${flowers.length} flower(s)).`,
          ...(flowerNote ? [flowerNote] : []),
          ...scoreAmerican().notes,
        ],
      };
    }
    const structure = decomposeHand(playingTiles);
    return {
      ...scoreAmerican(),
      isValidHand: structure.isValid,
      handDescription: structure.isValid
        ? "Valid 14-tile structure — match this against the NMJL card for points."
        : "14 tiles, but they don't form 4 sets + 1 pair. Check your melds.",
      notes: [
        ...(flowerNote ? [flowerNote] : []),
        ...scoreAmerican().notes,
      ],
    };
  }

  if (playingTiles.length !== 14) {
    return {
      totalPoints: "—",
      isValidHand: false,
      handDescription: `A standard winning hand needs exactly 14 tiles; you have ${playingTiles.length}.`,
      bonuses: [],
      notes: [
        "Add or remove tiles until you have 14 (4 sets + 1 pair).",
        ...(flowerNote ? [flowerNote] : []),
      ].filter(Boolean) as string[],
      confidence: "high",
    };
  }

  const structure = decomposeHand(playingTiles);

  if (!structure.isValid) {
    return {
      totalPoints: "0",
      isValidHand: false,
      handDescription:
        "These 14 tiles don't form a winning hand (need 4 sets of 3 + 1 pair).",
      bonuses: [],
      notes: [
        "Try rearranging — you may be one tile away from a win.",
        ...(flowerNote ? [flowerNote] : []),
      ],
      confidence: "high",
    };
  }

  const score = scoreValidHand(ruleSet, playingTiles, structure);

  if (flowerNote) {
    return { ...score, notes: [flowerNote, ...score.notes] };
  }
  return score;
}
