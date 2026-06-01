"use client";

import {
  CATEGORY_LABELS,
  TILES,
  TILE_BY_ID,
  type TileDefinition,
} from "@/lib/mahjong";

interface TilePickerProps {
  selectedTiles: string[];
  onChange: (tiles: string[]) => void;
}

const CATEGORIES = [
  "characters",
  "bamboos",
  "dots",
  "winds",
  "dragons",
  "flowers",
] as const;

export function TilePicker({ selectedTiles, onChange }: TilePickerProps) {
  function addTile(tileId: string) {
    onChange([...selectedTiles, tileId]);
  }

  function removeTile(index: number) {
    onChange(selectedTiles.filter((_, i) => i !== index));
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-ltc-black" style={{ fontFamily: "var(--font-readex)" }}>
          Your hand ({selectedTiles.length} tiles)
        </p>
        {selectedTiles.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-ltc-coral underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        className="min-h-[4.5rem] rounded-2xl border-2 border-dashed border-ltc-black/15 bg-ltc-white p-4"
        aria-label="Selected tiles"
      >
        {selectedTiles.length === 0 ? (
          <p className="text-center text-sm text-ltc-muted">
            Tap tiles below to build your hand
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTiles.map((id, index) => {
              const tile = TILE_BY_ID[id];
              return (
                <button
                  key={`${id}-${index}`}
                  type="button"
                  onClick={() => removeTile(index)}
                  className="group flex flex-col items-center rounded-xl border border-ltc-black/10 bg-ltc-cream px-2 py-1 transition-colors hover:border-ltc-coral hover:bg-ltc-coral/10"
                  title={`Remove ${tile?.label ?? id}`}
                >
                  <span className="text-2xl">{tile?.emoji ?? "🀫"}</span>
                  <span className="text-[10px] text-ltc-muted group-hover:text-ltc-coral">
                    {id}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {CATEGORIES.map((category) => {
        const categoryTiles = TILES.filter((t) => t.category === category);
        return (
          <TileCategory
            key={category}
            label={CATEGORY_LABELS[category]}
            tiles={categoryTiles}
            onSelect={addTile}
          />
        );
      })}
    </div>
  );
}

function TileCategory({
  label,
  tiles,
  onSelect,
}: {
  label: string;
  tiles: TileDefinition[];
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ltc-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelect(tile.id)}
            className="rounded-lg border border-ltc-black/10 bg-ltc-white px-2 py-1.5 text-xl transition-all hover:scale-105 hover:border-ltc-green hover:shadow-sm active:scale-95"
            title={tile.label}
            aria-label={`Add ${tile.label}`}
          >
            {tile.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
