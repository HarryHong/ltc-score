import type { MahjongRuleSet } from "../mahjong";
import type { PatternFlags } from "./patterns";

export interface BonusHint {
  label: string;
  value: string;
  /** Included in the total score shown above */
  counted: boolean;
  /** Depends on table context (self-draw, seat wind, etc.) */
  conditional?: boolean;
}

const WIND_LABELS: Record<string, string> = {
  E: "East",
  S: "South",
  W: "West",
  N: "North",
};

const DRAGON_LABELS: Record<string, string> = {
  RD: "Red",
  GD: "Green",
  WD: "White",
};

function windLabel(id: string): string {
  return WIND_LABELS[id] ?? id;
}

function dragonLabel(id: string): string {
  return DRAGON_LABELS[id] ?? id;
}

function sumCounted(bonuses: BonusHint[]): number {
  return bonuses
    .filter((b) => b.counted)
    .reduce((sum, b) => {
      const n = parseInt(b.value.replace(/[^\d]/g, ""), 10);
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
}

function selfDrawHint(value: string): BonusHint {
  return {
    label: "Self-draw (tsumo / zimo)",
    value,
    counted: false,
    conditional: true,
  };
}

function seatWindHints(p: PatternFlags, value: string): BonusHint[] {
  return p.windPungs.map((w) => ({
    label: `${windLabel(w)} wind pung — seat wind bonus`,
    value,
    counted: false,
    conditional: true,
  }));
}

function roundWindHints(p: PatternFlags, value: string): BonusHint[] {
  return p.windPungs.map((w) => ({
    label: `${windLabel(w)} wind pung — round wind bonus`,
    value,
    counted: false,
    conditional: true,
  }));
}

export function buildLtcBonuses(p: PatternFlags): BonusHint[] {
  const bonuses: BonusHint[] = [
    { label: "Base win", value: "+2 pts", counted: true },
    selfDrawHint("+1 pt"),
  ];

  if (p.allPungs) {
    bonuses.push({ label: "All pungs", value: "+3 pts", counted: true });
  } else {
    bonuses.push({ label: "All pungs", value: "+3 pts", counted: false });
  }

  if (p.fullFlush) {
    bonuses.push({ label: "One suit only (full flush)", value: "+4 pts", counted: true });
  } else {
    bonuses.push({ label: "One suit only (full flush)", value: "+4 pts", counted: false });
  }

  if (!p.fullFlush) {
    bonuses.push({
      label: "Mostly one suit (half flush)",
      value: "+2 pts",
      counted: p.halfFlush,
    });
  }

  bonuses.push({
    label: "All simple tiles (no 1/9/honors)",
    value: "+1 pt",
    counted: p.allSimples,
  });

  for (const d of p.dragonPungs) {
    bonuses.push({
      label: `${dragonLabel(d)} dragon set`,
      value: "+1 pt",
      counted: true,
    });
  }

  for (const w of p.windPungs) {
    bonuses.push({
      label: `${windLabel(w)} wind set`,
      value: "+1 pt",
      counted: true,
    });
  }

  bonuses.push(...seatWindHints(p, "+1 pt"));
  bonuses.push(...roundWindHints(p, "+1 pt"));

  return bonuses;
}

export function buildHongKongBonuses(p: PatternFlags): BonusHint[] {
  const bonuses: BonusHint[] = [
    { label: "Base win", value: "+1 faan", counted: true },
    selfDrawHint("+1 faan"),
  ];

  bonuses.push({
    label: "All pungs (peng peng hu)",
    value: "+3 faan",
    counted: p.allPungs,
  });

  if (!p.allPungs) {
    bonuses.push({
      label: "All chows (ping hu)",
      value: "+1 faan",
      counted: p.allChows,
    });
  }

  bonuses.push({
    label: "Full flush (qing yi se)",
    value: "+7 faan",
    counted: p.fullFlush,
  });

  if (!p.fullFlush) {
    bonuses.push({
      label: "Half flush (hun yi se)",
      value: "+3 faan",
      counted: p.halfFlush,
    });
  }

  bonuses.push({
    label: "All honors (zi yi se)",
    value: "+10 faan",
    counted: p.allHonors,
  });

  for (const d of p.dragonPungs) {
    bonuses.push({
      label: `${dragonLabel(d)} dragon pung`,
      value: "+1 faan",
      counted: true,
    });
  }

  for (const w of p.windPungs) {
    bonuses.push({
      label: `${windLabel(w)} wind pung`,
      value: "+1 faan",
      counted: true,
    });
  }

  bonuses.push(...seatWindHints(p, "+1 faan"));
  bonuses.push(...roundWindHints(p, "+1 faan"));

  if (p.pairIsDragon) {
    bonuses.push({ label: "Dragon pair", value: "+1 faan", counted: true });
  } else {
    bonuses.push({ label: "Dragon pair", value: "+1 faan", counted: false });
  }

  return bonuses;
}

export function buildRiichiBonuses(p: PatternFlags): BonusHint[] {
  const bonuses: BonusHint[] = [
    { label: "Base win", value: "+1 han", counted: true },
    selfDrawHint("+1 han (tsumo)"),
    {
      label: "Riichi declaration",
      value: "+1 han",
      counted: false,
      conditional: true,
    },
  ];

  bonuses.push({
    label: "Toitoi (all triplets)",
    value: "+2 han",
    counted: p.allPungs,
  });

  bonuses.push({
    label: "Chinitsu (full flush)",
    value: "+6 han",
    counted: p.fullFlush,
  });

  if (!p.fullFlush) {
    bonuses.push({
      label: "Honitsu (half flush)",
      value: "+3 han",
      counted: p.halfFlush,
    });
  }

  bonuses.push({
    label: "Tanyao (all simples)",
    value: "+1 han",
    counted: p.allSimples,
  });

  const hasDragonYaku =
    p.pairIsDragon || p.dragonPungs.length > 0;
  bonuses.push({
    label: "Yakuhai (dragon triplet or pair)",
    value: "+1 han",
    counted: hasDragonYaku,
  });

  for (const w of p.windPungs) {
    bonuses.push({
      label: `Yakuhai (${windLabel(w)} wind triplet)`,
      value: "+1 han",
      counted: true,
    });
    bonuses.push({
      label: `${windLabel(w)} wind — seat wind yakuhai`,
      value: "+1 han",
      counted: false,
      conditional: true,
    });
  }

  return bonuses;
}

export function buildTaiwaneseBonuses(p: PatternFlags): BonusHint[] {
  const bonuses: BonusHint[] = [
    { label: "Base win", value: "+1 tai", counted: true },
    selfDrawHint("+1 tai"),
  ];

  bonuses.push({ label: "All pungs", value: "+4 tai", counted: p.allPungs });
  bonuses.push({ label: "Full flush", value: "+8 tai", counted: p.fullFlush });

  if (!p.fullFlush) {
    bonuses.push({ label: "Half flush", value: "+4 tai", counted: p.halfFlush });
  }

  return bonuses;
}

export function buildMcrBonuses(p: PatternFlags): BonusHint[] {
  const bonuses: BonusHint[] = [
    { label: "Base win (ping hu)", value: "+2 fan", counted: true },
    selfDrawHint("+1 fan"),
  ];

  bonuses.push({
    label: "All pungs (peng peng hu)",
    value: "+6 fan",
    counted: p.allPungs,
  });
  bonuses.push({
    label: "Full flush (qing yi se)",
    value: "+24 fan",
    counted: p.fullFlush,
  });

  if (!p.fullFlush) {
    bonuses.push({
      label: "Half flush (hun yi se)",
      value: "+6 fan",
      counted: p.halfFlush,
    });
  }

  bonuses.push({
    label: "All honors",
    value: "+64 fan",
    counted: p.allHonors,
  });

  return bonuses;
}

export function buildBonusesForRule(
  ruleSet: MahjongRuleSet,
  p: PatternFlags
): BonusHint[] {
  switch (ruleSet) {
    case "hong-kong":
      return buildHongKongBonuses(p);
    case "ltc-house":
      return buildLtcBonuses(p);
    case "riichi":
      return buildRiichiBonuses(p);
    case "taiwanese":
      return buildTaiwaneseBonuses(p);
    case "chinese-official":
      return buildMcrBonuses(p);
    case "singaporean":
      return buildHongKongBonuses(p).map((b) => ({
        ...b,
        value: b.value.replace("faan", "tai"),
      }));
    default:
      return buildLtcBonuses(p);
  }
}

export function totalFromBonuses(bonuses: BonusHint[], unit: string): string {
  const total = sumCounted(bonuses);
  return `${total} ${unit}`;
}

export function ltcTotal(bonuses: BonusHint[]): string {
  return totalFromBonuses(bonuses, "points");
}

export function faanTotal(bonuses: BonusHint[]): string {
  return totalFromBonuses(bonuses, "faan");
}

export function taiTotal(bonuses: BonusHint[]): string {
  return totalFromBonuses(bonuses, "tai");
}

export function hanTotal(bonuses: BonusHint[]): string {
  return totalFromBonuses(bonuses, "han (simplified)");
}

export function fanTotal(bonuses: BonusHint[]): string {
  return totalFromBonuses(bonuses, "fan");
}

export function minToWin(ruleSet: MahjongRuleSet, total: number): boolean {
  switch (ruleSet) {
    case "hong-kong":
    case "singaporean":
      return total >= 3;
    case "taiwanese":
      return total >= 5;
    case "chinese-official":
      return total >= 8;
    default:
      return total > 0;
  }
}

export function sumCountedValue(bonuses: BonusHint[]): number {
  return bonuses
    .filter((b) => b.counted)
    .reduce((sum, b) => {
      const n = parseInt(b.value.replace(/[^\d]/g, ""), 10);
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
}
