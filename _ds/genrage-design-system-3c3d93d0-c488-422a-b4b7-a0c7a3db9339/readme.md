# GENRAGE — Design System

> The design system for **GENRAGE**, an India-based streetwear label. Baggy pants, boxy vests & tees, hoodies and jackets — "proudly homegrown in India," sold to a community it calls **RAGERS**.

This project is a reusable design system: brand tokens, foundation specimens, React UI primitives, and a full storefront UI kit, all rebuilt from the live GENRAGE Shopify theme.

---

## Sources

Everything here was reverse-engineered from a **static export of the live storefront**, mounted read-only:

- **Codebase:** `genrage.com (1)/` — a saved copy of the Shopify storefront (Prestige theme v10.10). Key files read:
  - `index.html` — homepage: inline theme CSS (all design tokens live here), header/nav, announcement bar, product grid.
  - `products/trishul-black-vest.html` — product detail page + product JSON (variants, pricing, ratings).
  - `collections/*.html` — collection/listing pages.
  - `css/theme.cb08a.css` — compiled theme stylesheet.
- **Live domain:** `https://genrage.com` — product imagery and the logo are referenced directly from the Shopify CDN (`genrage.com/cdn/shop/files/...`), which is public. The mounted export contained **no image binaries**, so kits and specimens link the CDN URLs.

> If reads ever fail or the CDN URLs 404, re-attach the export via the Import menu and re-run — do not invent product names, prices, or values.

---

## Brand at a glance

| | |
|---|---|
| **Name** | GENRAGE (always all-caps in the wordmark) |
| **Category** | Budget streetwear — India |
| **Community** | "RAGERS" (customers), "loved by 300,000+" |
| **Products** | Baggy pants & jeans, boxy oversized tees & vests, hoodies, jackets, shorts, baby tees, tank tops |
| **Naming** | One-word, ominous/mythic product names — *Trishul, Corpse, Vanta, Lilith, Monarch, Basilisk, Vigil, Forge, Ignite* — each paired with a colour + silhouette ("Trishul Black Vest") |
| **Currency** | INR — `Rs. {amount}` (e.g. `Rs. 999`) |
| **Positioning** | Sustainable, homegrown, affordable; heavy discounting ("Save 33%") |

---

## Logo & wordmark

- **Primary wordmark:** `https://genrage.com/cdn/shop/files/logo.png` — white "GENRAGE" logotype (2800×800), used on dark grounds in the header.
- **Monogram:** `https://genrage.com/cdn/shop/files/monogram_...png` — used as the transparent/scrolled header state.
- **Footer lockup:** `https://genrage.com/cdn/shop/files/logo_test_...png`.

These are the brand's real marks, referenced from the CDN — see `assets/README.md`. **No logo was redrawn or reconstructed.** Where the CDN is unavailable, render the wordmark as the word `GENRAGE` in Instrument Sans, uppercase, tight tracking.

---

## CONTENT FUNDAMENTALS

How GENRAGE writes.

- **Voice:** loud, hyped, second-person. Talks *to* the customer ("SHOP NOW", "loved by you"). Community-first — customers are **RAGERS**, not "users."
- **Casing:** display copy is **ALL CAPS** (nav, buttons, headings, announcement bar). Body/description copy is sentence case in Nunito. Product titles are Title Case ("Trishul Black Vest").
- **Tone:** urgent + reassuring at once. Hype ("JUST DROPPED", "LIMITED TIME OFFER") sits next to trust signals ("FREE DOORSTEP DELIVERY IN INDIA", "300,000+ HAPPY CUSTOMERS").
- **Punctuation & emoji:** the announcement bar uses emoji as accents — 🇮🇳 (India delivery), ⭐️ (loved), 🎧 (shop). Emoji are a *marketing-bar* device, not used inside product copy or UI chrome. Keep them sparse and functional.
- **Numbers/urgency:** discounts shown as "Save 33%", scarcity as "Only 3 left!", social proof as "300,000+".
- **Signature lines actually used:**
  - `FREE DOORSTEP DELIVERY IN INDIA 🇮🇳`
  - `LOVED BY 300,000+ HAPPY CUSTOMERS! ⭐️`
  - `LIMITED TIME OFFER, SHOP NOW! 🎧`
  - `NEW ARRIVALS` / `JUST DROPPED`
  - `PROUDLY HOMEGROWN IN INDIA`
  - `Let RAGERS' speak for us` (reviews section)
- **CTAs:** short, imperative, uppercase — `ADD TO CART`, `SHOP ALL`, `SHOP NOW`, `BUY IT NOW`.

---

## VISUAL FOUNDATIONS

- **Palette:** monochrome. True black (`#000`), ink (`#1c1c1c`), a concrete grey (`#c4c4c4`) used as a full-section background, hairline greys, and paper white. Colour is *functional only*: sale **red** `#c5312d` ("Save 33%") and rating/in-stock **green** `#47a730` (stars). Max 1–2 background colours per surface. No gradients, no purple, no pastels.
- **Type:** **Instrument Sans** for all display (uppercase, tracking `-0.01em`, tight leading) + **Nunito** for body (sentence case, generous 1.6 leading). The contrast between the hard uppercase display and the rounded, friendly Nunito body is the core typographic move.
- **Backgrounds:** product photography on plain studio/white or concrete-grey grounds — no busy textures, no illustration. One concrete-grey section ("signature" band) breaks up the white. Occasional full-bleed dark hero.
- **Imagery vibe:** cool, neutral, studio-lit. Flat-lay and on-body ecommerce shots, mostly on white or grey seamless. No heavy grain or filters; true-to-garment colour. Aspect ratio ~0.8 (tall 4:5) for product cards.
- **Corners:** near-square everywhere. Inputs & cards `0px`; buttons `2px` (the only rounding); circular icon buttons & size chips are pills.
- **Borders:** thin `1px` hairlines — `#ddd` on light, `#262626` on dark, `#a7a7a7` for stronger dividers.
- **Cards (product):** no border, no shadow, no rounding — just the image, then title / price / rating stacked below. Depth comes from the photo, not chrome. A second image cross-fades in on hover.
- **Shadows:** whisper-soft and rare — `0 5px 15px rgb(0 0 0 / .05)`. Reserved for drawers/modals, never product cards.
- **Animation:** restrained. Hovers = opacity/colour swap or image cross-fade (~200ms, ease-out). No bounce, no spring. Reveal-on-scroll fade for product rows. Presses nudge down ~1px.
- **Hover states:** links fade to ~60% opacity; primary buttons deepen ink→black; product image swaps to alt shot.
- **Press states:** subtle darken + 1px translate; no scale-down.
- **Transparency/blur:** minimal. Scrim behind drawers/modals is `rgb(0 0 0 / .4)`. No frosted glass.
- **Badges:** hard rectangles, no radius. On-sale = red fill white text; sold-out = white fill muted text; custom = black fill white text. Sit top-left of the product image, stacked vertically.
- **Layout:** centred containers up to 1360px, 3rem desktop gutter. Sticky header. 4-up product grid on desktop, 2-up mobile. Vertical section rhythm ~3rem.

---

## ICONOGRAPHY

- **System:** the storefront uses **inline monoline SVG icons** drawn at a `24×24` viewbox with `stroke="currentColor"`, `stroke-width="2"`, round caps/joins. Thin, geometric, no fills. This is a **custom set** (account, search, cart, chevron, close, star) — *not* a named icon font.
- **Closest CDN match:** **Lucide** (`https://unpkg.com/lucide@latest`) — same 24px grid, 2px stroke, round caps. Kits/components use Lucide as a drop-in stand-in for the brand set. **Flagged substitution** — swap for the brand SVGs if exact parity is needed. Inline SVG snippets that match the originals live in `assets/icons/`.
- **Stars:** rating stars render in green `#47a730` (Judge.me reviews).
- **Emoji:** used *only* in the marketing announcement bar (🇮🇳 ⭐️ 🎧). Never in UI chrome or product copy.
- **No PNG icons, no icon font, no unicode-as-icon** in the UI.

See `assets/README.md` for the full asset + CDN URL manifest.

---

## Index / manifest

Root files:
- `styles.css` — global entry (imports only). **Consumers link this.**
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/README.md` — logo, product-image and icon URL manifest; `assets/icons/*.svg`.
- `thumbnail.html` — homepage tile for this design system.
- `SKILL.md` — Agent-Skills-compatible entry point.

Foundations (Design System tab cards):
- `guidelines/*.card.html` — colour, type, spacing, radii, shadow, badge, brand specimens.

Components (`components/`) — React primitives, one folder per concern:
- `core/` — **Button**, **IconButton**, **Badge**, **PriceTag**, **RatingStars**
- `forms/` — **SizeSelector**, **QuantityStepper**
- `product/` — **ProductCard**, **AnnouncementBar**

UI kit (`ui_kits/storefront/`) — interactive storefront recreation:
- `index.html` + `Header.jsx`, `AnnouncementBar.jsx`, `Hero.jsx`, `ProductGrid.jsx`, `ProductDetail.jsx`, `CartDrawer.jsx`, `Footer.jsx`, `data.js`.

Slides (`slides/`) — branded 16:9 deck templates (`TitleSlide`, `DropSlide`, `StatSlide`, `LookbookSlide`, `QuoteSlide`).

## Intentional additions
- **PriceTag** & **RatingStars** — not standalone "components" in the source, but the price (regular + struck compare-at + red sale) and green star rating are repeated verbatim across cards and PDP, so they're factored out as primitives.
- **QuantityStepper** — implied by the cart drawer; added for kit completeness.

## Caveats
- Fonts load from Google Fonts (identical families to the brand's self-hosted Instrument Sans + Nunito).
- Icons use **Lucide** as a stand-in for the brand's custom monoline SVG set.
- Product images & logo are linked from the live `genrage.com` CDN, not bundled.
