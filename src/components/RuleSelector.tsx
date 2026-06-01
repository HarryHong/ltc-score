"use client";

import { MAHJONG_RULES, type MahjongRuleSet } from "@/lib/mahjong";

interface RuleSelectorProps {
  value: MahjongRuleSet;
  onChange: (value: MahjongRuleSet) => void;
}

export function RuleSelector({ value, onChange }: RuleSelectorProps) {
  const selected = MAHJONG_RULES.find((r) => r.id === value);

  return (
    <div className="space-y-2">
      <label
        htmlFor="rule-set"
        className="block text-sm font-semibold uppercase tracking-wide text-ltc-black"
        style={{ fontFamily: "var(--font-readex)" }}
      >
        Which rules are you playing?
      </label>
      <select
        id="rule-set"
        value={value}
        onChange={(e) => onChange(e.target.value as MahjongRuleSet)}
        className="w-full rounded-full border-2 border-ltc-black/15 bg-ltc-white px-5 py-3 text-base outline-none transition-colors focus:border-ltc-green"
      >
        {MAHJONG_RULES.map((rule) => (
          <option key={rule.id} value={rule.id}>
            {rule.label}
          </option>
        ))}
      </select>
      {selected && (
        <p className="text-sm text-ltc-muted">{selected.description}</p>
      )}
    </div>
  );
}
