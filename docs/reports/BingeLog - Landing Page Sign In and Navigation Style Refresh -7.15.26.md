# BingeLog - Landing Page Sign In and Navigation Style Refresh -7.15.26

## Overview

A visual consistency pass across the landing page, the Sign Up/Login forms, and the main navigation bar. The goal was to bring all three in line with a single shared design language — the site's existing CSS custom-property palette, a softer layered-shadow convention, pill-shaped interactive elements, and consistent typography — since each had drifted independently (raw hardcoded colors, dead/never-matching CSS selectors, unstyled buttons, and a couple of real layout bugs hiding underneath the visual inconsistency).

Every change follows the repo's existing "paired stylesheet" convention already used elsewhere (`BioUPDATE.module.css`, `MyShowsUPDATE.module.css`, etc.): a new `*UPDATE.module.css` file is added, the original import is commented out (not deleted), and the new one is wired in active. Nothing old was destroyed — everything is there to compare or revert.

---

## Landing Page

**Files:** new `src/pages/Home/HomePageUPDATE.module.css`; `src/pages/Home/LandingPage.jsx` rewired to use it (old `HomePage.module.css` import commented out, left in place; `HomePage.jsx` untouched since it never actually used any class from that file).

**What was wrong:**
- `.learnMoreLink` used raw `blue`/`pink` — colors with no relationship to the site's violet/cerulean/xanthous/sinopia palette.
- `.ctaWrapper span` hardcoded `#301a4bff`, which is byte-identical to `var(--russian-violet)` — a duplicate value that could silently drift from the palette later.
- `.title p` had two `text-shadow` declarations back to back; the first (`5px black`) is invalid CSS (missing a required length) and was immediately overwritten by the second — dead code.
- Several rules used bare `"Alan Sans"` with no fallback, instead of `var(--body-font)` (which already carries the correct fallback stack).
- Two real, if subtle, **layout bugs**: `.mainWrapper` and `.title` used `align-content: center` in a single-line `flex-direction: column` container — `align-content` has no effect without `flex-wrap: wrap`, so it was silently doing nothing. The property that actually centers children there is `align-items`. Fixed in both places.
- A **CSS specificity trap**: `.ctaWrapper div { padding-top: 40px }` (a class+element selector) was more specific than `.cta1`/`.cta3`'s own class selector, so it silently overrode their intended padding regardless of source order. Removed; `.cta1`/`.cta2`/`.cta3` now each declare their own explicit padding.

**What's new:**
- `.mainWrapper` now uses a subtle `linear-gradient(180deg, var(--cerulean), #2c5c73ff)` instead of a flat fill, matching the gradient convention already used in `BioUPDATE.module.css`.
- CTA cards (`.cta1/2/3`) got a proportional soft `box-shadow` where they previously had none.
- `.learnMoreLink` is now a violet-filled, xanthous-bordered pill with a `:hover` lift (`transform: translateY(-1px)` + color shift) — the same interaction pattern used throughout the rest of the refresh.
- Added `.loginToggleBttn` for the "Or Login Here" button (previously **completely unstyled** — a bare browser default button). Deliberately styled as a secondary/ghost treatment — an outlined cerulean pill that fills solid on hover — rather than a clone of the primary Sign Up button, so the two don't visually compete.

---

## Sign Up / Login Forms

**Files:** `src/components/UI/SignUpForm.module.css` (shared — `LogInForm.jsx` imports this exact file too, so every fix here applied to both forms for free); `src/components/UI/SignUpForm.jsx` and `src/components/LoginLogOut/LogInForm.jsx` updated to use the renamed button class; `src/components/UI/Input.module.css` deliberately left untouched.

**The headline bug:** the stylesheet had:
```css
Input::placeholder { color: rgb(117, 117, 117); font-size: 14px; font-style: italic; }
Input { font-size: 15px; margin-bottom: 10px; }
```
`Input` here is the **name of the React component**, not an HTML element — the actual DOM node it renders is a lowercase `<input>`. CSS type selectors match literal tag names, and there's no such thing as an `<Input>` tag, so both rules were dead code that had never matched anything since the day they were written. Every input field and its placeholder text had been completely unstyled by these rules the whole time.

**What's new:**
- Replaced the dead selectors with real, scoped ones: `.inputWrapper input`, `.inputWrapper input:focus`, `.inputWrapper input::placeholder`.
- Text fields now have an actual white background, soft border, `10px` radius, subtle inset shadow, and a cerulean focus ring — legible against the light `.loginSignUp` card they sit inside.
- `<label>` elements (previously invisible/default browser styling) now have real typography: `var(--body-font)`, `var(--raisin-black)`, a small weight/letter-spacing treatment above each field.
- `.signUpBttn` → renamed **`.authBttn`** and applied to *both* forms. The Login form's "Sign In" button had **no className at all** before this — it was rendering as a bare, unstyled native browser button sitting right next to a polished Sign Up button in the same visual flow (Login opens in a modal triggered from the same landing-page card). Now both share identical, deliberate styling: pill radius, two-layer soft shadow (replacing one previous maxed-out `rgba(0,0,0,0.863)` shadow), xanthous fill, and `:hover`/`:active`/`:disabled` states — the `:disabled` state now also gives visible feedback for the double-submit guard added earlier this session (the button visibly grays out while a signup request is in flight, instead of just silently becoming unclickable).
- `Input.module.css` was intentionally left minimal/structural — that component is also reused for an unrelated checkbox in `ShowNotes.jsx`, so all the new visual weight lives scoped inside `SignUpForm.module.css`'s own `.inputWrapper`, where it can't leak onto that unrelated usage.

---

## Navigation Bar

**Files:** `src/components/UI/MainNav.module.css`; `src/components/UI/MainNav.jsx` (added `className` props only — no logic changes).

**What was wrong:** the nav bar referenced **zero** palette tokens — a flat `grey` background layered under a 13-stop black-to-gray `linear-gradient` that had nothing to do with the rest of the site, a hard `border-top: 1px solid black`, and a single flat `box-shadow: 2px 4px 10px 4px black`. No font-family was declared at all. Nav icons were bare `<img>` tags with no hover/active affordance, and the logout button was a plain unstyled native `<button>`.

**What's new:**
- Background replaced with a solid `var(--raisin-black)` — a persistent bottom bar reads better as a flat, confident dark surface than a gradient (gradients were reserved for hero-style surfaces like the landing page).
- Border softened to a cerulean-tinted hairline (`rgba(64, 120, 153, 0.35)`); corner radius bumped from `10px` to `18px`, closer to the `16px` card-radius convention used elsewhere.
- Shadow replaced with a two-layer *upward* shadow (negative Y-offset) — intentional, since a fixed bottom bar should look like it casts shadow onto the content above it, not below itself off-screen.
- Text color changed from pure `White` to `whitesmoke` (matches the off-white used on other dark surfaces), and `var(--body-font)` was added — previously missing entirely.
- Added `z-index: 10` — nothing currently conflicts, but a fixed nav with no declared stacking value is a common trap once more fixed/sticky elements get added later.
- Each nav icon now has a pill-shaped hit target: a cerulean-tinted hover lift, and — using React Router's auto-applied `.active` class on `NavLink` — a distinct xanthous-tinted highlight for whichever route is currently active, so the current page is visually obvious at a glance. The logout button gets a sinopia-tinted hover as a subtle "this is a different kind of action" cue.

---

## Shared Foundation: Two Site-Wide CSS Bugs Fixed

These weren't scoped to any one component, but they're why fonts now render as intended everywhere touched by this refresh:

1. **`src/index.css`**: `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }` referenced a variable that didn't exist — the real one is named `--heading-font`. Every heading site-wide had been silently falling back to the generic system font stack. Fixed to reference `--heading-font` correctly, which is a **visible, site-wide change** (all headings now actually render in "Alan Sans" instead of the fallback they'd quietly been using).
2. **`src/index.css`**: `--app-title: 'Poetson One', ...` had a typo — the real loaded Google Font (confirmed in `index.html`) is "Poetsen One". Nothing currently uses this variable (both landing-page stylesheets hardcode the correct literal name directly), so this had no visible effect yet, but it's now correct for whenever it is used.

---

## Design Tokens Referenced Throughout

All three areas above pull from the same palette, defined once in `src/index.css`:

```css
--body-font: 'Alan Sans', ui-sans-serif, system-ui, ...;
--heading-font: 'Alan Sans', Georgia, 'Times New Roman', serif;
--russian-violet: #301a4bff;
--cerulean:       #407899ff;
--xanthous:       #f3b61fff;
--sinopia:        #c73e1dff;
--raisin-black:   #272727ff;
```

Recurring conventions applied consistently across all three areas: pill-shaped buttons (`border-radius: 999px`), two-layer soft `rgba(0,0,0,alpha)` shadows instead of a single maxed-out one, `:hover` states that combine a color shift with a small `translateY` lift, and no raw named CSS colors (`black`, `grey`, `pink`, `blue`) anywhere in the new code — only the palette variables above, or deliberate `rgba()` for shadow/overlay purposes.

## Notes for Next Session

- Everything here is additive/parallel — the original `HomePage.module.css` and `MainNav.module.css`'s prior state remain fully intact (commented import for the landing page; `MainNav.module.css` was edited in place since there's no existing paired-file convention duplicated there yet, but the change is a straightforward rewrite of the same selectors, easily diffed via git).
- A separate, unrelated but significant finding from this session: `react-router-dom`, `react-redux`, and `@reduxjs/toolkit` were missing from `package.json`/`package-lock.json` despite being used throughout the app — the app only worked locally because a stray `node_modules` one directory up happened to satisfy the imports. This has been fixed (all three now properly declared and installed at their previously-resolved versions: `react-router-dom@7.8.0`, `react-redux@9.2.0`, `@reduxjs/toolkit@2.9.0`), which matters for anyone cloning the repo fresh or building via CI/deploy. See `npm audit` output (19 vulnerabilities flagged across the dependency tree) as a follow-up item, not yet addressed.
