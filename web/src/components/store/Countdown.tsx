"use client";

import { useEffect, useState } from "react";

// Flip countdown to a target time. Each two-digit unit flips down when it
// changes (via a re-keyed span + CSS animation, disabled for reduced-motion).
// Calls onExpire once when it reaches zero (e.g. to refresh the page state).
export function Countdown({
  endsAt,
  onExpire,
  size = "md",
  showDays = true,
  className = "",
}: {
  endsAt: string; // ISO
  onExpire?: () => void;
  size?: "sm" | "md" | "lg";
  showDays?: boolean;
  className?: string;
}) {
  const target = new Date(endsAt).getTime();
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    setRemaining(Math.max(0, target - Date.now()));
    const id = setInterval(() => {
      const r = Math.max(0, target - Date.now());
      setRemaining(r);
      if (r <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);

  const totalSec = Math.floor(remaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const units: { v: number; l: string }[] = [
    ...(showDays ? [{ v: days, l: "days" }] : []),
    { v: hours, l: "hrs" },
    { v: mins, l: "min" },
    { v: secs, l: "sec" },
  ];

  const box =
    size === "lg"
      ? "min-w-[2.4rem] text-2xl sm:text-3xl px-2 py-1.5"
      : size === "sm"
        ? "min-w-[1.5rem] text-sm px-1 py-0.5"
        : "min-w-[2rem] text-lg px-1.5 py-1";
  const label = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`inline-flex items-start gap-1.5 ${className}`} aria-label="Countdown">
      {units.map((u, i) => (
        <div key={u.l} className="flex items-start gap-1.5">
          <div className="text-center">
            <div className={`bg-ink text-white font-display tabular-nums rounded-button ${box} [perspective:200px]`}>
              {/* re-key on value so the flip animation replays each change */}
              <span key={u.v} className="flip-digit block">
                {String(u.v).padStart(2, "0")}
              </span>
            </div>
            <div className={`font-display tracking-label text-grey-500 mt-1 ${label}`}>{u.l}</div>
          </div>
          {i < units.length - 1 && (
            <span className={`font-display text-grey-400 ${size === "lg" ? "text-2xl" : "text-lg"} leading-none pt-1`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
