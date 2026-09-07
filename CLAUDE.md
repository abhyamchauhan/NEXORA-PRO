# NEXORA — working notes for Claude Code

You are continuing a **finished, running website**, not implementing a design spec.
Everything in this folder is production-ready static files: no build step, no bundler,
no package.json, no dependencies to install.

## Run it

Must be served over `http://` — ES modules are blocked on `file://`.

```bash
python3 -m http.server 8080      # then open http://localhost:8080/NEXORA.dc.html
```

Or `./serve.sh` / `serve.cmd`, or VS Code → Live Server on `NEXORA.dc.html`.

## Architecture

| File | Role |
|---|---|
| `NEXORA.dc.html` | The entire storefront: markup template + logic class, one file |
| `ProductCard.dc.html` | Product card, imported by the storefront |
| `nexora-3d.js` | three.js garment engine — ES module, exports `buildLook`, `createStage`, `renderThumb`, `bakeFrames` |
| `nexora-ai.js` | Photo → garment spec — ES module, exports `analyseLocally`, `analyseGarment` |
| `nexora-data.js` | Catalogue, categories, campaigns, currency — **the only file to edit for content** |
| `support.js` | The component runtime. **Do not edit.** |
| `_ds/` | GENRAGE design system: tokens, styles, component bundle |
| `assets/` | Campaign and product photography |
| `index.html` | Launcher — redirects when served, explains the server step when opened from disk |

Routing is hash-based (`#/`, `#/c/:cat`, `#/p/:id`, `#/studio`, `#/checkout`, …), parsed in
`applyHash()`. Any static host works; no server rewrites needed.

## The one file format you must understand

`NEXORA.dc.html` is a **Design Component**: a normal HTML document whose `<x-dc>` body is a
template, plus one `<script data-dc-script>` holding `class Component extends DCLogic`.
`support.js` compiles the template to React and renders it. Edit it as plain text — it is
just HTML and JS.

Template rules, all of which the runtime enforces:

- **`{{ }}` holes are dotted lookups only** — `{{ user.name }}`, `{{ $index }}`. No
  expressions: `{{ a + b }}`, `{{ !x }}`, `{{ fn() }}` render nothing. Compute in
  `renderVals()` and expose the result by name.
- **`renderVals()` returns everything the template reads** — values, arrays, and handlers.
  It is split into `shellVals()`, `homeVals()`, `catalogVals()`, `productVals()`,
  `studioVals()`, `bagVals()`, `checkoutVals()`, `accountVals()`, all spread together at
  the bottom of the class.
- **Loops and conditionals** are `<sc-for list="{{ items }}" as="item">` and
  `<sc-if value="{{ flag }}">`. Keep the `hint-*` attributes.
- **Child components** mount as `<dc-import name="ProductCard" c="{{ c }}">`; design-system
  components as `<x-import component-from-global-scope="GENRAGEDesignSystem_3c3d93.Button">`.
  Always write the explicit closing tag.
- **Styling is inline `style="…"` only.** No stylesheets, no CSS classes. Pseudo-states are
  `style-hover` / `style-active` / `style-focus`. The only `<style>` block allowed is inside
  `<helmet>` at the top, for `@keyframes` and body resets.
- Event handlers are camelCase whole-value attrs: `onClick="{{ handler }}"`.

If you would rather work in React/Vue/Next, treat this file as the reference implementation:
the logic class is already ordinary React class-component code (state, `setState`,
lifecycle), so porting is mostly moving `renderVals()` output into JSX.

## Where to change what

- **Add or edit products, categories, campaigns, prices** → `nexora-data.js` only. Each
  product's `garment` field (`"hoodie"`, `"jacket"`, `"pants"`, `"skirt"`, `"dress"`,
  `"tee"`, `"vest"`, `"shirt"`, `"kurta"`, `"polo"`, `"cap"`, `"bag"`) selects its 3D block.
- **Change a garment's shape** → `buildLook()` in `nexora-3d.js`. Bodies are `LatheGeometry`
  profiles: arrays of `[radius, height]` points up the figure, metres, feet at `y=0`.
- **Lighting, materials, camera framing** → `makeScene()`, `fabricMat()`, `placeCamera()` in
  `nexora-3d.js`.
- **Render quality** → `quality()` in `NEXORA.dc.html` (thumb size, turntable frame count).
- **Copy, layout, new screens** → the template in `NEXORA.dc.html`, plus a matching
  `*Vals()` method and a route branch in `applyHash()`.

## The 3D, precisely

Garments are **parametric blocks** built in three.js and draped on a stylized mannequin —
no model files, no GLB, nothing to download. Three consumers of the same scene:

1. `renderThumb()` bakes a single clay render → product cards and grids.
2. `bakeFrames()` bakes a 36-frame turntable → the product page viewer (drag, zoom, pan,
   fullscreen, frame scrubber).
3. `createStage()` runs a live interactive viewer → home hero and 3D Studio (orbit, zoom,
   wireframe, walk-cycle animation).

Renders are cached in `this.thumbs` / `this.frameCache` and baked lazily in `pumpThumbs()`.
three.js is imported from `unpkg.com` at a pinned version, so first load needs a network
connection. To go fully offline, vendor `three.module.js` next to `nexora-3d.js` and change
the one import at the top of that file.

**To swap in real 3D models:** replace the body of `buildLook(spec)` with a `GLTFLoader`
call returning a `THREE.Group`. Nothing else in the app touches geometry — the three
consumers above, the caches, and every screen keep working unchanged.

## The AI studio (`#/studio`)

1. `analyseLocally()` measures the uploaded photo on a 72px canvas: dominant colour buckets,
   silhouette width profile (upper / mid / hem), surface variance, subject coverage.
2. `analyseGarment()` sends the image plus those metrics to Claude via
   `window.claude.complete` and clamps the JSON reply against an allow-list.
3. If Claude is unavailable it falls back to `heuristicGarment()` / `heuristicFabric()`, so
   the studio always returns a usable spec.
4. The spec drives `buildLook()`; the user edits any field and publishes into the catalogue.

**`window.claude.complete` only exists inside the Claude artifact host.** Served from your
own machine or a static host, step 2 fails and the local fallback runs — the studio still
works, just without Claude's classification. To wire real inference, replace the
`window.claude.complete` calls in `nexora-ai.js` with a `fetch` to your own backend holding
the API key. Never put an API key in this client-side code.

**Honest limit:** the output is a stylized parametric twin, not a photogrammetric scan. True
photo-to-mesh reconstruction needs a server-side ML model.

## Persistence

Cart, wishlist, published garments, recently-viewed, and the signed-in user all live in
`localStorage` under `nexora.v1` (`restore()` / `persist()`). There is no backend. Checkout
is simulated end to end — no card is charged. Accounts are browser-local; no real passwords.

## Conventions to keep

- **GENRAGE design system**: monochrome only. Black `#000`, ink `#1c1c1c`, concrete `#c4c4c4`,
  bone `#e9e5dd`, hairlines `#262626`/`#1c1c1c`. Colour is functional only — sale red
  `#c5312d`, rating green `#47a730`. No gradients.
- **Type**: Instrument Sans for display (uppercase, tracking `-0.02em`), Nunito for body
  (sentence case, 1.6–1.7 leading). Reference them as
  `var(--font-display, 'Instrument Sans', sans-serif)` / `var(--font-body, 'Nunito', sans-serif)`.
- **Corners** near-square: cards and inputs `0`, buttons `2px`. Shadows only on drawers and
  modals. Hovers are ~200ms opacity or colour swaps — no bounce, no scale.
- **Copy** is loud and uppercase in display, plain in body. Prices are `Rs. 1,899` (INR).
- Layout uses flex/grid with `gap`, containers max `1360px`, gutters `clamp(16px,3vw,48px)`.

## Known gotchas

- `componentDidUpdate` receives **prevProps, not prevState** in this runtime. The
  scroll-to-top on route change therefore compares a route key by value — don't revert it to
  an identity check or the page yanks to the top on every re-render.
- Do not call `scrollIntoView` anywhere; it breaks the host preview.
- Product images are `<img>` inside fixed-aspect containers; keep the aspect box or lazy
  thumbnail baking will shift the layout.
- Live Server caches `NEXORA.dc.html` hard — hard-refresh after edits.
