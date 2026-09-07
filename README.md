# NEXORA — 3D clothing storefront

A local, pre-animated 3D fashion storefront. Nine screens, real three.js garments, and an
AI studio that turns a garment photograph into a parametric 3D twin.

## Run it (30 seconds)

**It must be served over `http://` — not opened by double-click.** Browsers block JavaScript
modules on `file://` URLs, so double-clicking `NEXORA.dc.html` renders a blank page. There is
no build step and no dependencies to install.

**VS Code (recommended)**
1. Open this folder in VS Code (`File → Open Folder`).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `NEXORA.dc.html` in the explorer → **Open with Live Server**.

**Terminal — Python**
```bash
python3 -m http.server 8080     # Windows: py -m http.server 8080
```
then open <http://localhost:8080/NEXORA.dc.html>

**Terminal — Node**
```bash
npx serve .
```

**Shortcuts** — `./serve.sh` (macOS/Linux) or `serve.cmd` (double-click, Windows).

Opening `index.html` first is safe either way: served over http it forwards to the storefront;
opened from disk it explains the one step above.

## Screens

`#/` home · `#/c/:category` category + filters · `#/p/:id` product + 360° viewer ·
`#/collections` lookbook · `#/studio` 3D Studio · `#/search?q=` · `#/wishlist` · `#/cart` ·
`#/checkout` · `#/login` · `#/account`

Routing is hash-based, so refresh and browser back/forward work with any static server.

## Files

| File | What it is |
|---|---|
| `NEXORA.dc.html` | The whole storefront — markup, routing, state |
| `ProductCard.dc.html` | Product card component |
| `nexora-3d.js` | Parametric garment engine: clay renders, 36-frame turntables, live viewer |
| `nexora-ai.js` | Photo → garment spec: local image analysis + Claude classification |
| `nexora-data.js` | Catalogue, categories, campaigns, INR pricing |
| `support.js` | Component runtime |
| `assets/` | Campaign and product photography |
| `_ds/` | GENRAGE design system — tokens, styles, components |

To change the catalogue, edit `nexora-data.js` only; the UI reads nothing else.

## The 3D

Garments are **parametric blocks** built in three.js — hoodie, jacket, tee, vest, baggy pants,
pleat skirt, column dress, shirt, kurta, polo, cap, tote — draped on a stylized mannequin with
studio lighting and contact shadows. Product cards and grids are live renders; the product-page
viewer plays a 36-frame turntable baked from the same scene (drag to rotate, zoom, pan,
fullscreen); home and Studio run the interactive viewer with wireframe and walk-cycle toggles.

three.js loads from a CDN, so first load needs an internet connection.

## The AI studio (`#/studio`)

1. Drop a garment photo.
2. Local canvas analysis measures dominant colour, silhouette width profile, and weave variance.
3. Claude classifies garment type, fabric, fit, and writes the copy — with the local metrics as
   the fallback if Claude is unreachable.
4. The parametric block builds it live. Every field is editable, then **Publish to catalogue**
   adds it to the shop (saved in this browser).

**Honest limit:** these are stylized parametric twins, not photogrammetric scans. True
photo-to-mesh reconstruction needs a server-side ML model, which a static local site cannot run.

## Continuing in Claude Code

Open this folder as your working directory. `CLAUDE.md` sits at the root and Claude Code
reads it automatically — it documents the architecture, the one file format you need to
understand, where to change what, the 3D and AI pipelines, the design-system rules, and the
known gotchas. Start by asking it to read `CLAUDE.md`, then describe what you want changed.

There is nothing to install and no build step, so Claude Code can edit and you can refresh.

## Notes

- Cart, wishlist, published garments, and recently-viewed persist to `localStorage`.
- Checkout is simulated end to end — no card is charged and no payment is processed.
- Accounts are local to the browser; no server, no passwords stored anywhere real.
