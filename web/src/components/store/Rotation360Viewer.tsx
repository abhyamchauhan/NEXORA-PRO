"use client";

import { useEffect, useRef, useState } from "react";

// 360° turntable: drag-to-rotate (desktop) / swipe (mobile), preloads the whole
// sequence with a loading state, and auto-rotates as a preview on load + hover.
export function Rotation360Viewer({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [frame, setFrame] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [auto, setAuto] = useState(true);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const interacted = useRef(false);

  const ready = loaded >= images.length;
  const pct = Math.round((loaded / images.length) * 100);

  // Preload every frame.
  useEffect(() => {
    let alive = true;
    setLoaded(0);
    images.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => alive && setLoaded((n) => n + 1);
      img.src = src;
    });
    return () => {
      alive = false;
    };
  }, [images]);

  // Auto-rotate preview.
  useEffect(() => {
    if (!ready || !auto) return;
    const id = setInterval(
      () => setFrame((f) => (f + 1) % images.length),
      90,
    );
    return () => clearInterval(id);
  }, [ready, auto, images.length]);

  function onDown(e: React.PointerEvent) {
    dragging.current = true;
    lastX.current = e.clientX;
    interacted.current = true;
    setAuto(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const per = 6; // px per frame
    const delta = e.clientX - lastX.current;
    if (Math.abs(delta) >= per) {
      const move = Math.round(delta / per);
      setFrame((f) => ((f + move) % images.length + images.length) % images.length);
      lastX.current = e.clientX;
    }
  }
  function onUp() {
    dragging.current = false;
  }

  return (
    <div
      className="relative aspect-[4/5] bg-grey-50 select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={() => {
        onUp();
        setAuto(false);
      }}
      onMouseEnter={() => !interacted.current && setAuto(true)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[frame]}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-grey-50">
          <div className="text-center">
            <div className="font-display text-2xl">{pct}%</div>
            <div className="text-xs text-grey-500 tracking-label mt-1">
              LOADING 360°
            </div>
          </div>
        </div>
      )}

      {ready && (
        <>
          <span className="absolute top-3 left-3 bg-ink text-white text-[10px] font-display tracking-button px-2 py-1">
            360°
          </span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-grey-500 bg-white/70 px-2 py-1">
            drag to rotate
          </span>
          <input
            type="range"
            min={0}
            max={images.length - 1}
            value={frame}
            onChange={(e) => {
              setAuto(false);
              interacted.current = true;
              setFrame(Number(e.target.value));
            }}
            className="absolute bottom-2 right-3 w-24 accent-ink"
            aria-label="Rotate"
          />
        </>
      )}
    </div>
  );
}
