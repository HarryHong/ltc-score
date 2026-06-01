"use client";

import { useCallback, useState } from "react";
import type { MahjongRuleSet, ScoreResult } from "@/lib/mahjong";
import { calculateHandScore } from "@/lib/scoring";
import { ImageUpload } from "./ImageUpload";
import { RuleSelector } from "./RuleSelector";
import { ScoreDisplay } from "./ScoreDisplay";
import { TilePicker } from "./TilePicker";

type InputMode = "manual" | "photo";

export function HandCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [ruleSet, setRuleSet] = useState<MahjongRuleSet>("ltc-house");
  const [tiles, setTiles] = useState<string[]>([]);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handleScanComplete = useCallback((scannedTiles: string[]) => {
    setTiles(scannedTiles);
    setOcrError(null);
    setInputMode("manual");
  }, []);

  function calculateScore() {
    if (tiles.length === 0) {
      setScoreError("Add at least one tile before calculating.");
      return;
    }

    setScoreError(null);

    try {
      setScoreResult(calculateHandScore(tiles, ruleSet));
    } catch (err) {
      setScoreResult(null);
      setScoreError(
        err instanceof Error ? err.message : "Could not calculate score"
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="mb-10 text-center">
        <h1
          className="text-5xl leading-tight text-ltc-black md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hand Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ltc-muted">
          Upload a photo to scan tiles, or build your hand manually — scoring
          runs instantly on your device. May your next hand be auspicious{" "}
          <span className="ltc-wave inline-block">🀄</span>
        </p>
      </section>

      <div className="mb-8">
        <RuleSelector value={ruleSet} onChange={setRuleSet} />
      </div>

      <div className="mb-6 flex rounded-full bg-ltc-white p-1 shadow-sm">
        {(
          [
            { id: "manual" as const, label: "Enter by hand" },
            { id: "photo" as const, label: "Scan photo" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setInputMode(tab.id)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              inputMode === tab.id
                ? "bg-ltc-coral text-white shadow-sm"
                : "text-ltc-muted hover:text-ltc-black"
            }`}
            style={{ fontFamily: "var(--font-readex)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-2xl bg-ltc-white p-6 shadow-sm">
          {inputMode === "photo" ? (
            <>
              <ImageUpload
                onScanComplete={handleScanComplete}
                onScanError={setOcrError}
              />
              {ocrError && (
                <p className="text-sm text-ltc-coral">{ocrError}</p>
              )}
              {tiles.length > 0 && (
                <p className="text-sm text-ltc-green">
                  Found {tiles.length} tiles — review below, then calculate.
                </p>
              )}
            </>
          ) : null}

          <TilePicker selectedTiles={tiles} onChange={setTiles} />

          <button
            type="button"
            onClick={calculateScore}
            disabled={tiles.length === 0}
            className="w-full rounded-full bg-ltc-green py-4 text-base font-bold text-white transition-all hover:bg-ltc-green/90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontFamily: "var(--font-readex)" }}
          >
            Calculate my score
          </button>
        </div>

        <div>
          <ScoreDisplay
            result={scoreResult}
            loading={false}
            error={scoreError}
          />
        </div>
      </div>
    </div>
  );
}
