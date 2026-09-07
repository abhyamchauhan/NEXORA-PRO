# NEXORA — source repository

repo: abhyamchauhan/NEXORA
branch: main

The repository is currently **empty** (no commits on `main`), so nothing was imported;
this project's screens were authored from the brief and the GENRAGE design system.
On the next sync, real files will be diffed against this record.

## Last sync

date: 2026-09-07T00:00:00Z
state: empty repository — tree endpoint returned no commits

### Updated in this project

- Built the NEXORA storefront as a single Design Component (`NEXORA.dc.html`) with hash routing.
- Added the parametric 3D garment engine (`nexora-3d.js`) — clay renders, 36-frame turntables, live viewer.
- Added the 3D Studio photo→garment pipeline (`nexora-ai.js`) — local image analysis + Claude classification.
- Seeded the catalogue and category tree (`nexora-data.js`), INR pricing.
- Added the campaign photography set (`assets/campaign-*.jpg`), a Collections lookbook page, per-campaign banners and photo-on-hover product cards.

## Screen map

| Screen | Built from |
|---|---|
| Home | `NEXORA.dc.html` (homeVals) · `nexora-3d.js` · `nexora-data.js` |
| Category + filters | `NEXORA.dc.html` (catalogVals) |
| Product + 360 viewer | `NEXORA.dc.html` (productVals) · `nexora-3d.js` (bakeFrames) |
| 3D Studio | `NEXORA.dc.html` (studioVals) · `nexora-ai.js` · `nexora-3d.js` (createStage) |
| Search / Wishlist / Cart | `NEXORA.dc.html` (shellVals, bagVals) |
| Checkout | `NEXORA.dc.html` (checkoutVals) |
| Log in / Account | `NEXORA.dc.html` (accountVals) |
| Product card | `ProductCard.dc.html` |
| Collections lookbook | `NEXORA.dc.html` (homeVals.collectionRows) · `assets/campaign-*.jpg` |
