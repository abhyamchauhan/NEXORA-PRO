"use client";

import { useRef, useState } from "react";

async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
  if (!sigRes.ok) throw new Error("Could not get an upload signature.");
  const sig = await sigRes.json();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await up.json();
  if (!up.ok || !data.secure_url) throw new Error(data?.error?.message || "Upload failed.");
  return data.secure_url as string;
}

// Small single-image field: preview + upload + clear. Calls onChange with the
// Cloudinary URL (or null when cleared).
export function AdminImageInput({
  value,
  onChange,
  label = "Image",
  aspect = "aspect-[4/5]",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pick(file?: File) {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      onChange(await uploadToCloudinary(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="font-display text-[11px] tracking-label text-grey-500">{label}</span>
      <div className={`mt-1 relative ${aspect} w-full max-w-[160px] bg-grey-50 border border-grey-200 overflow-hidden`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 grid place-items-center text-xs text-grey-500 hover:text-ink"
          >
            {busy ? "Uploading…" : "+ Upload"}
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 bg-white/90 text-sale text-[10px] px-1.5 py-0.5"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {err && <p className="text-xs text-sale mt-1">{err}</p>}
    </div>
  );
}
