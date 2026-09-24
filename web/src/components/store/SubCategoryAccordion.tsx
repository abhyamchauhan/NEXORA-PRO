"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import type { CategoryGroup } from "@/lib/category";

// Expandable accordion of sub-category groups (Topwear / Bottomwear / …). Each
// group holds a grid of image tiles: an "All <group>" tile plus one per
// sub-category. Tiles animate on hover (darken + label lifts + arrow slides in)
// and link to the filtered listing.
export function SubCategoryAccordion({
  category,
  groups,
}: {
  category: string;
  groups: CategoryGroup[];
}) {
  // All groups open by default.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.group)),
  );

  const toggle = (g: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  if (groups.length === 0) return null;

  return (
    <div className="max-w-container mx-auto px-6 py-12 space-y-4">
      {groups.map((g) => {
        const isOpen = open.has(g.group);
        return (
          <div key={g.group} className="border-b border-grey-200">
            <button
              onClick={() => toggle(g.group)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-2xl sm:text-3xl tracking-button">{g.group}</span>
              <span
                className={`text-2xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-8 pt-1">
                  <Tile
                    href={`/shop?category=${category}&group=${encodeURIComponent(g.group)}`}
                    name={`All ${g.group}`}
                    image={g.tiles.find((t) => t.image)?.image ?? null}
                    all
                  />
                  {g.tiles.map((t) => (
                    <Tile
                      key={t.id}
                      href={`/shop?category=${category}&sub=${encodeURIComponent(t.slug)}`}
                      name={t.name}
                      image={t.image}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Tile({
  href,
  name,
  image,
  all = false,
}: {
  href: string;
  name: string;
  image: string | null;
  all?: boolean;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-grey-50">
      {image ? (
        <ProductImage
          src={image}
          alt={name}
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-grey-300 font-display text-3xl">
          {name.charAt(0)}
        </div>
      )}

      {/* darken overlay intensifies on hover */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          all ? "bg-black/45 group-hover:bg-black/55" : "bg-black/20 group-hover:bg-black/40"
        }`}
      />

      {/* label lifts up; arrow slides in on hover */}
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between text-white">
        <span className="font-display text-sm tracking-button transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
          {name}
        </span>
        <span
          aria-hidden
          className="font-display text-sm opacity-0 -translate-x-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
        >
          →
        </span>
      </div>
    </Link>
  );
}
