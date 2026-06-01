export type MahjongRuleSet =
  | "american-nmjl"
  | "hong-kong"
  | "riichi"
  | "taiwanese"
  | "chinese-official"
  | "singaporean"
  | "ltc-house";

export interface RuleOption {
  id: MahjongRuleSet;
  label: string;
  description: string;
}

export const MAHJONG_RULES: RuleOption[] = [
  {
    id: "american-nmjl",
    label: "American Mahjong (NMJL)",
    description: "National Mah Jongg League card-based scoring",
  },
  {
    id: "hong-kong",
    label: "Hong Kong Old Style",
    description: "Traditional HK scoring with faan (doubles)",
  },
  {
    id: "riichi",
    label: "Riichi (Japanese)",
    description: "Modern Japanese mahjong with han/fu",
  },
  {
    id: "taiwanese",
    label: "Taiwanese Mahjong",
    description: "16-tile hands with tai scoring",
  },
  {
    id: "chinese-official",
    label: "Chinese Official (MCR)",
    description: "Competition mahjong fan-based scoring",
  },
  {
    id: "singaporean",
    label: "Singaporean Mahjong",
    description: "Local SG rules with tai and special hands",
  },
  {
    id: "ltc-house",
    label: "LTC House Rules",
    description: "Lucky Tile Club beginner-friendly scoring",
  },
];

export interface TileDefinition {
  id: string;
  label: string;
  emoji: string;
  category: "characters" | "bamboos" | "dots" | "winds" | "dragons" | "flowers";
}

export const TILES: TileDefinition[] = [
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}m`,
    label: `${i + 1} Character`,
    emoji: ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"][i],
    category: "characters" as const,
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}s`,
    label: `${i + 1} Bamboo`,
    emoji: ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"][i],
    category: "bamboos" as const,
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}p`,
    label: `${i + 1} Dot`,
    emoji: ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"][i],
    category: "dots" as const,
  })),
  { id: "E", label: "East Wind", emoji: "🀀", category: "winds" },
  { id: "S", label: "South Wind", emoji: "🀁", category: "winds" },
  { id: "W", label: "West Wind", emoji: "🀂", category: "winds" },
  { id: "N", label: "North Wind", emoji: "🀃", category: "winds" },
  { id: "RD", label: "Red Dragon", emoji: "🀄", category: "dragons" },
  { id: "GD", label: "Green Dragon", emoji: "🀅", category: "dragons" },
  { id: "WD", label: "White Dragon", emoji: "🀆", category: "dragons" },
  { id: "F", label: "Flower", emoji: "🀢", category: "flowers" },
  { id: "SP", label: "Season", emoji: "🀣", category: "flowers" },
];

export const TILE_BY_ID = Object.fromEntries(TILES.map((t) => [t.id, t]));

export const CATEGORY_LABELS: Record<TileDefinition["category"], string> = {
  characters: "Characters (万)",
  bamboos: "Bamboos (索)",
  dots: "Dots (筒)",
  winds: "Winds",
  dragons: "Dragons",
  flowers: "Flowers & Seasons",
};

export interface BonusHint {
  label: string;
  value: string;
  counted: boolean;
  conditional?: boolean;
}

export interface ScoreResult {
  totalPoints: string;
  isValidHand: boolean;
  handDescription: string;
  bonuses: BonusHint[];
  notes: string[];
  confidence: "high" | "medium" | "low";
}

export interface OcrResult {
  tiles: string[];
  rawDescription: string;
  confidence: "high" | "medium" | "low";
}
