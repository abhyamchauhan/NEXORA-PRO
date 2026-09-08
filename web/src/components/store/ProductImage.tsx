"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMG } from "@/lib/format";

// next/image with a graceful fallback to the placeholder when a URL is missing
// or fails to load (e.g. seeded demo rows before real Cloudinary uploads).
export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  fit = "cover",
  className = "",
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  // "contain" keeps a background-removed garment fully visible, centred on the
  // product's background colour; "cover" is the default for legacy full-bleed art.
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [error, setError] = useState(false);
  const resolved = !src || error ? PLACEHOLDER_IMG : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
      priority={priority}
      onError={() => setError(true)}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
