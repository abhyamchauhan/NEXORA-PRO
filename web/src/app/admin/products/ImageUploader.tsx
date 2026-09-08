"use client";

import { useRef, useState } from "react";

type Props = {
  mode: "static" | "rotation360";
  images: string[]; // display URLs (background removed when successful)
  imagesOriginal: string[]; // raw upload, parallel to images — used as backup / retry source
  labels: string[];
  onChange: (images: string[], imagesOriginal: string[], labels: string[]) => void;
};

const STATIC_SUGGESTIONS = ["Front", "Back", "Side", "Close-up", "Detail", "Fit"];

// A photo has a real cut-out when it has a backup original AND its display URL
// differs from it (every successful cut-out is a fresh upload). If the two are
// equal, an attempted removal fell back to the original ("BG kept"). If there
// is no backup at all, the image predates removal (legacy) — it can still be
// cut out on demand.
const hasCutout = (images: string[], originals: string[], i: number) =>
  !!originals[i] && !!images[i] && images[i] !== originals[i];
const removalFailed = (images: string[], originals: string[], i: number) =>
  !!originals[i] && !!images[i] && images[i] === originals[i];

async function uploadToCloudinary(file: Blob, filename?: string): Promise<string> {
  const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
  if (!sigRes.ok) {
    const d = await sigRes.json().catch(() => ({}));
    throw new Error(d.error || "Could not get an upload signature.");
  }
  const sig = await sigRes.json();

  const fd = new FormData();
  fd.append("file", file, filename);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: fd },
  );
  const data = await up.json();
  if (!up.ok || !data.secure_url)
    throw new Error(data?.error?.message || "Upload failed.");
  return data.secure_url as string;
}

// Client-side background removal (@imgly/background-removal). The ~40 MB WASM
// model is fetched lazily the first time this runs, so keep the import dynamic.
async function cutOut(input: Blob | string): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  return removeBackground(input, { output: { format: "image/png" } });
}

export function ImageUploader({
  mode,
  images,
  imagesOriginal,
  labels,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [working, setWorking] = useState<number[]>([]); // indices being processed
  const [error, setError] = useState<string | null>(null);
  const isWorking = (i: number) => working.includes(i);

  const maxSlots = mode === "rotation360" ? 16 : 6;
  const remaining = maxSlots - images.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    const nextImages = [...images];
    const nextOriginals = [...imagesOriginal];
    const nextLabels = [...labels];
    const batch = Array.from(files).slice(0, remaining);
    try {
      for (let n = 0; n < batch.length; n++) {
        const file = batch[n];
        setProgress(`Uploading ${n + 1} of ${batch.length}…`);
        // 1. Upload the untouched original first — the reliable backup.
        const originalUrl = await uploadToCloudinary(file, file.name);
        // 2. Attempt background removal; on any failure keep the original as
        //    the display image (it will be flagged for retry).
        let displayUrl = originalUrl;
        try {
          setProgress(`Removing background ${n + 1} of ${batch.length}…`);
          const cut = await cutOut(file);
          displayUrl = await uploadToCloudinary(cut, "nexora-cutout.png");
        } catch (e) {
          // removal failed — display falls back to the original (flagged for retry)
          setError(
            `Auto-removal failed for one photo (${
              e instanceof Error ? e.message : "unknown error"
            }). The original was kept — use “Remove background” on it to try again.`,
          );
        }
        nextImages.push(displayUrl);
        nextOriginals.push(originalUrl);
        nextLabels.push(
          mode === "static" ? STATIC_SUGGESTIONS[nextImages.length - 1] ?? "" : "",
        );
        onChange([...nextImages], [...nextOriginals], [...nextLabels]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Remove the background of an already-uploaded photo (works for legacy images
  // uploaded before this feature, failed auto-removals, or a re-do). The source
  // is the stored original when present, otherwise the current display image —
  // which then becomes the preserved backup.
  async function removeBgAt(i: number) {
    const src = imagesOriginal[i] || images[i];
    if (!src) return;
    setError(null);
    setWorking((w) => [...w, i]);
    try {
      const cut = await cutOut(src);
      const displayUrl = await uploadToCloudinary(cut, "nexora-cutout.png");
      const ni = [...images];
      const no = [...imagesOriginal];
      ni[i] = displayUrl;
      no[i] = src; // keep the pre-removal image as the backup
      onChange(ni, no, [...labels]);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Background removal failed: ${e.message}`
          : "Background removal failed. Check your connection and try again.",
      );
    } finally {
      setWorking((w) => w.filter((x) => x !== i));
    }
  }

  function removeAt(i: number) {
    onChange(
      images.filter((_, idx) => idx !== i),
      imagesOriginal.filter((_, idx) => idx !== i),
      labels.filter((_, idx) => idx !== i),
    );
  }

  function setLabel(i: number, value: string) {
    const next = [...labels];
    next[i] = value;
    onChange(images, imagesOriginal, next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const ni = [...images];
    const no = [...imagesOriginal];
    const nl = [...labels];
    [ni[i], ni[j]] = [ni[j], ni[i]];
    [no[i], no[j]] = [no[j], no[i]];
    [nl[i], nl[j]] = [nl[j], nl[i]];
    onChange(ni, no, nl);
  }

  const target =
    mode === "rotation360"
      ? "12–16 photos, garment rotated in even increments (turntable recommended). Order = rotation order."
      : "4–6 photos. Add a short caption for each (Front, Back, Side, Close-up).";

  return (
    <div>
      <p className="text-xs text-grey-500 mb-1">{target}</p>
      <p className="text-xs text-grey-400 mb-3">
        New uploads have their background removed automatically in your browser,
        keeping the original as a backup. For a photo added earlier (or if
        removal failed), use <b>Remove background</b> on the photo. First run
        downloads a one-time model (~40&nbsp;MB), so give it a few seconds.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => {
          const failed = removalFailed(images, imagesOriginal, i);
          const done = hasCutout(images, imagesOriginal, i);
          const legacy = !failed && !done; // uploaded before removal / not yet cut out
          const proc = isWorking(i);
          return (
            <div
              key={url + i}
              className={`border bg-white ${failed ? "border-sale" : "border-grey-200"}`}
            >
              <div
                className="relative aspect-square"
                style={{
                  // checkerboard so transparency is visible in the editor
                  backgroundColor: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={labels[i] || `Image ${i + 1}`}
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-1 left-1 bg-ink text-white text-[10px] px-1.5 py-0.5 font-display tracking-button">
                  {mode === "rotation360" ? `Photo ${i + 1} of ${maxSlots}` : `${i + 1}`}
                </span>
                {failed && (
                  <span className="absolute top-1 right-1 bg-sale text-white text-[10px] px-1.5 py-0.5 font-display tracking-button">
                    BG kept
                  </span>
                )}
                {done && (
                  <span className="absolute top-1 right-1 bg-rating text-white text-[10px] px-1.5 py-0.5 font-display tracking-button">
                    BG removed
                  </span>
                )}
                {proc && (
                  <span className="absolute inset-0 grid place-items-center bg-white/70 text-[11px] font-display tracking-button text-ink">
                    Removing…
                  </span>
                )}
              </div>
              <div className="p-1.5 space-y-1">
                {(legacy || failed) && (
                  <button
                    type="button"
                    onClick={() => removeBgAt(i)}
                    disabled={proc}
                    className={`w-full text-[11px] px-1.5 py-1 transition-colors disabled:opacity-50 border ${
                      failed
                        ? "border-sale text-sale hover:bg-sale hover:text-white"
                        : "border-ink text-ink hover:bg-ink hover:text-white"
                    }`}
                  >
                    {proc
                      ? "Removing…"
                      : failed
                        ? "Retry removal"
                        : "Remove background"}
                  </button>
                )}
                {done && (
                  <button
                    type="button"
                    onClick={() => removeBgAt(i)}
                    disabled={proc}
                    className="w-full text-[11px] px-1.5 py-1 border border-grey-200 text-grey-500 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
                  >
                    {proc ? "Removing…" : "Redo removal"}
                  </button>
                )}
                {mode === "static" && (
                  <input
                    value={labels[i] ?? ""}
                    onChange={(e) => setLabel(i, e.target.value)}
                    placeholder="Caption"
                    className="w-full border border-grey-200 px-1.5 py-1 text-xs outline-none focus:border-ink"
                  />
                )}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} className="px-1 hover:text-ink text-grey-400">←</button>
                    <button type="button" onClick={() => move(i, 1)} className="px-1 hover:text-ink text-grey-400">→</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="text-sale hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square border border-dashed border-grey-300 flex flex-col items-center justify-center text-grey-500 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[11px] mt-1 text-center px-1 leading-tight">
              {busy ? progress ?? "Working…" : "Add photo"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-grey-400 mt-2">
        {images.length}/{maxSlots} photos
      </p>
      {error && <p className="text-xs text-sale mt-1">{error}</p>}
    </div>
  );
}
