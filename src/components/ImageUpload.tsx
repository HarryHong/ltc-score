"use client";

import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  onScanComplete: (tiles: string[]) => void;
  onScanError: (message: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  onScanComplete,
  onScanError,
  disabled,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const scanImage = useCallback(
    async (file: File) => {
      setScanning(true);
      onScanError("");

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Scan failed");
        }

        onScanComplete(data.tiles ?? []);
      } catch (err) {
        onScanError(
          err instanceof Error ? err.message : "Could not scan image"
        );
      } finally {
        setScanning(false);
      }
    },
    [onScanComplete, onScanError]
  );

  function handleFile(file: File | null) {
    if (!file || disabled) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    scanImage(file);
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm font-semibold uppercase tracking-wide text-ltc-black"
        style={{ fontFamily: "var(--font-readex)" }}
      >
        Upload a photo of your hand
      </p>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0] ?? null);
        }}
        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 transition-colors ${
          dragOver
            ? "border-ltc-green bg-ltc-green/5"
            : "border-ltc-black/20 bg-ltc-white hover:border-ltc-green/50"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Uploaded mahjong hand"
            className="max-h-40 rounded-lg object-contain"
          />
        ) : (
          <>
            <span className="text-4xl">📷</span>
            <p className="mt-3 text-center text-sm text-ltc-muted">
              Drop a photo here, or click to upload
            </p>
            <p className="mt-1 text-xs text-ltc-muted">
              Lay tiles face-up for best results
            </p>
          </>
        )}

        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ltc-white/90">
            <p
              className="animate-pulse text-sm font-semibold text-ltc-green"
              style={{ fontFamily: "var(--font-readex)" }}
            >
              Scanning tiles…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
