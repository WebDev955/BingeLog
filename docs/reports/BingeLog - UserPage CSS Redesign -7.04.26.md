# BingeLog - UserPage CSS Redesign -7.04.26

**Date:** 2026-07-04
**Scope:** `src/pages/UserPage/` and its subfolders (`Bio/`, `CurrentlyWatching/`, `MyReviews/`, `MyShows/`)
**Files touched:** 10 new `*UPDATE.module.css` files + 10 JSX import swaps (originals untouched, old imports commented out for easy revert)

## Why this pass happened

The UserPage components (profile bio, shows list, season/episode details, notes, reviews, currently-binging) were functionally complete but visually inconsistent — every component picked its own colors, spacing, and corner radii independently, so nothing read as one designed app.

## What was actually wrong (audit findings)

| Issue | Where | Why it matters |
|---|---|---|
| Off-palette colors | `goldenrod`, `royalblue`, `cadetblue`, `seagreen`, `palevioletred`, `grey`, `lightgrey` used directly instead of the app's defined tokens (`--cerulean`, `--xanthous`, `--sinopia`, `--raisin-black`, `--russian-violet`) | Creates visual noise — each screen feels like a different app instead of one product |
| No spacing/radius/shadow system | All 10 files | Cards, headers, and buttons don't align to a common rhythm, so the eye has to re-calibrate on every section |
| Fixed pixel widths | `412px`, `410px`, `400px`, `390px` hardcoded in `UserPage`, `Bio`, `ShowNotes` | Brittle on anything narrower than ~412px; not how modern responsive layout is done |
| Unstyled native controls | `<button>`, `<select>`, `<textarea>` in `MyShows`, `ShowReview`, `ShowNotes` | Falls back to raw browser chrome — no hover/focus feedback, inconsistent with the rest of the UI |
| Global CSS leak (bug) | `ShowReview.module.css` had a bare `textarea { }` rule | CSS Modules only scope **class** selectors, not bare element selectors — this rule was leaking onto *every* `<textarea>` in the app, not just the review box |
| Plain-text status/ratings | "Complete" / "Binging" labels, "3/5 Stars" text | No visual hierarchy — status and rating are the most scannable info on the page and were rendered identically to body text |

## What changed, and the reasoning

**1. Consolidated onto the existing palette.**
Every stray named color was replaced with the app's own `--cerulean` / `--xanthous` / `--sinopia` / `--raisin-black` / `--russian-violet` variables (defined in `index.css`), plus translucent black/white overlays (`rgba(0,0,0,0.2)` etc.) for depth instead of introducing new hues. This is the single highest-leverage change — a small, deliberate palette used consistently reads as "designed"; five colors used once each reads as accidental.

**2. Introduced a repeatable visual language.**
- Radius: 10px for buttons/inputs, 12–14px for cards, 999px (pill) for badges and sort buttons.
- Elevation: soft `box-shadow` (`0 4px 14px rgba(0,0,0,.3–.35)`) replacing hard 1–2px solid borders, so cards look lifted rather than boxed-in.
- Hairline dividers: `rgba(255,255,255,0.12–0.15)` instead of solid `white`/`black`, which reads as an intentional separator rather than a leftover default border.
This is the same idea behind any design-token system (Material Design's elevation scale, Tailwind's default spacing/radius scale) — a small fixed set of values reused everywhere, rather than ad hoc numbers per component.

**3. Converted status/rating text into badges.**
"Complete" and "Binging" labels now sit in pill-shaped chips (`border-radius: 999px`, translucent dark background) instead of bare colored text. Review scores and show titles got distinct background bands to separate metadata from body content. This follows the common "chip/badge" pattern (Gmail labels, GitHub PR status, Material Design Chips) for scannable, low-emphasis metadata.

**4. Styled native form controls.**
Buttons, `<select>`, and `<textarea>` across `MyShows`, `ShowNotes`, and `ShowReview` got consistent padding, radius, background, and — importantly — `:hover`/`:focus` states (e.g., a `box-shadow` focus ring in `--xanthous` on textareas). Default browser controls have no visual relationship to a custom-styled app and no focus indication tuned to the design; adding an explicit focus ring is also a baseline accessibility expectation (WCAG 2.4.7 — visible focus indicator).

**5. Fixed the CSS leak in `ShowReview`.**
Rescoped the bare `textarea { }` to `.reviewDivWrapper textarea { }`. This isn't a stylistic choice, it's a correctness fix: the old rule was silently overriding textarea styling everywhere else in the app.

**6. Replaced fixed pixel widths with fluid sizing.**
`width: 412px` / `410px` / `400px` → `width: 100%` with `max-width` where a card-like ceiling still made sense. The layout keeps its current "phone-frame" feel by default but no longer breaks or overflows on narrower viewports.

**7. Clickability and cursor affordance.**
`.showHeading` (the clickable show-title row in `MyShows`) now gets `cursor: pointer` — a one-line fix, but it's the kind of detail that separates "looks like an app" from "looks like a prototype," since the row was already interactive via `onClick`.

## Does this align with standard industry practice?

Mostly yes, with the caveats noted below.

**Aligned:**
- **Design tokens reused consistently** (fixed color/radius/shadow/spacing values) — the foundational idea behind Material Design, Apple's HIG, and utility frameworks like Tailwind.
- **Card + elevation model** for list items (shows, reviews, episodes) — standard in both Material Design and iOS-style apps for grouping related content.
- **Badges/chips for status and metadata** — a well-established pattern (GitHub, Linear, Material Design Chips) for compact, scannable state.
- **Explicit hover/focus states on interactive elements** — expected baseline in any professional UI, and a WCAG 2.1 accessibility criterion (visible focus).
- **CSS Modules scoping correctness** (fixing the global `textarea` leak) — modules are only doing their job if every rule is actually scoped; this brings the file in line with how CSS Modules are meant to be used.
- **Fluid width over hardcoded pixels** — standard responsive-design practice; avoids breakage on any viewport narrower than the old hardcoded value.

**Not fully addressed (worth calling out honestly):**
- **No formal design-token file.** Values (radius, shadow, spacing) are repeated as literals across the 10 new files rather than centralized as CSS custom properties in one place. Real production design systems centralize these; I kept them as local literals specifically so each file stays self-contained and swappable one at a time per your review workflow. If you adopt the new files, promoting the repeated values into `:root` variables in `index.css` would be the natural next step.
- **Contrast wasn't formally audited.** Colors were chosen to look coherent, but I didn't run contrast-ratio checks (WCAG AA is 4.5:1 for body text) on every text/background pairing — e.g., `--xanthous` (`#f3b61f`) text/background combinations should be spot-checked, since bright yellow-on-dark and dark-on-yellow can sit close to the AA line depending on font size.
- **Only CSS was changed, not markup.** Star ratings are still literal text ("3/5 Stars") rather than a visual star component, and status badges reuse existing DOM structure rather than semantic additions (e.g., `aria-label`s for status chips). Since you asked me to touch only the 10 CSS files, deeper polish (real star icons, ARIA labeling) would require JSX changes I intentionally didn't make.
- **Fixed-width "phone frame" feel was preserved, not redesigned.** I made widths fluid so they don't break, but I didn't attempt a true responsive layout (e.g., multi-column on tablet/desktop) since that would be a layout decision beyond a CSS-only pass.

## Files

New (preview-only, side-by-side with originals):
- `src/pages/UserPage/UserPageUPDATE.module.css`
- `src/pages/UserPage/Bio/BioUPDATE.module.css`
- `src/pages/UserPage/Bio/BioEditUPDATE.module.css`
- `src/pages/UserPage/CurrentlyWatching/CurrentlyWatchingUPDATE.module.css`
- `src/pages/UserPage/MyReviews/MyReviewsUPDATE.module.css`
- `src/pages/UserPage/MyShows/EpisodeDetailsUPDATE.module.css`
- `src/pages/UserPage/MyShows/MyShowsUPDATE.module.css`
- `src/pages/UserPage/MyShows/ShowDetailsUPDATE.module.css`
- `src/pages/UserPage/MyShows/ShowNotesUPDATE.module.css`
- `src/pages/UserPage/MyShows/ShowReviewUPDATE.module.css`

JSX files updated to import the `UPDATE` stylesheets (original import lines commented out, not deleted, for one-line revert):
- `src/pages/UserPage/UserPage.jsx`
- `src/pages/UserPage/Bio/Bio.jsx`
- `src/pages/UserPage/Bio/BioEdit.jsx`
- `src/pages/UserPage/CurrentlyWatching/CurrentlyWatching.jsx`
- `src/pages/UserPage/MyReviews/MyReviews.jsx`
- `src/pages/UserPage/MyShows/EpisodeDetails.jsx`
- `src/pages/UserPage/MyShows/MyShows.jsx`
- `src/pages/UserPage/MyShows/ShowDetails.jsx`
- `src/pages/UserPage/MyShows/ShowNotes.jsx`
- `src/pages/UserPage/MyShows/ShowReview.jsx`
