"use client";

import type { BonusHint, ScoreResult } from "@/lib/mahjong";

interface ScoreDisplayProps {
  result: ScoreResult | null;
  loading: boolean;
  error: string | null;
}

const CONFIDENCE_COLORS = {
  high: "bg-ltc-green/15 text-ltc-green",
  medium: "bg-ltc-coral/15 text-ltc-coral",
  low: "bg-ltc-black/10 text-ltc-muted",
};

function BonusRow({ bonus }: { bonus: BonusHint }) {
  if (bonus.counted) {
    return (
      <li className="flex items-center justify-between rounded-lg bg-ltc-green/10 px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-ltc-black">
          <span className="font-bold text-ltc-green" aria-hidden>
            ✓
          </span>
          {bonus.label}
        </span>
        <span className="font-semibold text-ltc-green">{bonus.value}</span>
      </li>
    );
  }

  if (bonus.conditional) {
    return (
      <li className="flex items-center justify-between rounded-lg border border-dashed border-ltc-black/15 bg-ltc-cream px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-ltc-muted">
          <span aria-hidden>+</span>
          {bonus.label}
        </span>
        <span className="text-ltc-muted">{bonus.value} if applicable</span>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-lg bg-ltc-black/5 px-4 py-2 text-sm text-ltc-muted">
      <span className="flex items-center gap-2">
        <span aria-hidden>—</span>
        {bonus.label}
      </span>
      <span>{bonus.value} if in hand</span>
    </li>
  );
}

export function ScoreDisplay({ result, loading, error }: ScoreDisplayProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-ltc-green/30 bg-ltc-white p-8 text-center">
        <p
          className="animate-pulse text-lg font-semibold text-ltc-green"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Calculating your score…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-ltc-coral/40 bg-ltc-coral/5 p-6">
        <p className="font-semibold text-ltc-coral">Something went wrong</p>
        <p className="mt-1 text-sm text-ltc-muted">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-ltc-black/15 bg-ltc-white/50 p-8 text-center">
        <p className="text-4xl">🀄</p>
        <p
          className="mt-3 text-lg text-ltc-muted"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your score will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border-2 border-ltc-green/30 bg-ltc-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ltc-muted">
            Score from your tiles
          </p>
          <p
            className="mt-1 text-4xl text-ltc-green md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {result.totalPoints}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${CONFIDENCE_COLORS[result.confidence]}`}
        >
          {result.confidence} confidence
        </span>
      </div>

      <div
        className={`rounded-xl px-4 py-3 ${
          result.isValidHand
            ? "bg-ltc-green/10 text-ltc-green"
            : "bg-ltc-coral/10 text-ltc-coral"
        }`}
      >
        <p className="text-sm font-semibold">
          {result.isValidHand ? "Valid winning hand" : "Not a complete winning hand"}
        </p>
      </div>

      <p className="leading-relaxed text-ltc-black">{result.handDescription}</p>

      {result.bonuses.length > 0 && (
        <div>
          <p
            className="mb-1 text-sm font-semibold uppercase tracking-wide text-ltc-black"
            style={{ fontFamily: "var(--font-readex)" }}
          >
            Bonuses
          </p>
          <p className="mb-3 text-xs text-ltc-muted">
            ✓ counted in total · + add if applicable · — not in this hand
          </p>
          <ul className="space-y-2">
            {result.bonuses.map((bonus, i) => (
              <BonusRow key={`${bonus.label}-${i}`} bonus={bonus} />
            ))}
          </ul>
        </div>
      )}

      {result.notes.length > 0 && (
        <div className="border-t border-ltc-black/10 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-ltc-muted">
            Notes
          </p>
          <ul className="space-y-1 text-sm text-ltc-muted">
            {result.notes.map((note, i) => (
              <li key={i}>• {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
