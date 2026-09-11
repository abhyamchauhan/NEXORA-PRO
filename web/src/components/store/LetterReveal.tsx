"use client";

// Splits a heading into letters that fade/slide in with a small per-letter
// stagger on load. Only for large decorative headings — never body/labels.
// The whole string is exposed to assistive tech via aria-label; the per-letter
// spans are aria-hidden so screen readers read it normally.
export function LetterReveal({
  text,
  className = "",
  step = 0.04, // seconds between letters
  start = 0, // initial delay
}: {
  text: string;
  className?: string;
  step?: number;
  start?: number;
}) {
  const letters = Array.from(text);
  return (
    <span className={`letter-reveal ${className}`} aria-label={text}>
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{ ["--d" as string]: `${start + i * step}s` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
