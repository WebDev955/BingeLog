# BingeLog - Session Bug Fixes -7.15.26

## Overview

Follow-up session continuing the punch-list pass from the prior report (`BingeLog - Session Bug Fixes -7.14.26.md`). Covers a form-component prop mismatch, a double-submit guard on account creation, and one item that was investigated but is still open.

---

## Fixes Applied

### 1. `Input` component — wrong prop name (`attribute` vs `htmlFor`)
**Files:** `src/components/UI/Input.jsx`, consumed by `SignUpForm.jsx` and `LogInForm.jsx`
**Problem:** `Input.jsx` destructured a prop called `attribute` and used it for the label's `htmlFor`:
```js
function Input({ label, id, attribute, ...props }) {
  <label htmlFor={attribute}>{label}</label>
  <input id={id} {...props} />
}
```
But every call site in the codebase (`SignUpForm.jsx` ×3, `LogInForm.jsx` ×2) actually passed a prop named `htmlFor`, never `attribute`. Since `attribute` was never supplied, the label's `htmlFor` was always `undefined` — clicking a label never focused its input. Worse, the real `htmlFor` value passed in wasn't just ignored — it fell into `...props` (since the destructure didn't capture it) and got spread onto the `<input>` element instead, where `htmlFor` isn't a valid attribute and is silently discarded by the browser.
**Fix:** Renamed the destructured field in `Input.jsx` from `attribute` to `htmlFor`, matching what every existing caller already passes. One-line fix in the shared component instead of editing five call sites.

### 2. No double-submit guard on account creation
**Files:** `src/components/UI/Signup.jsx`, `src/components/UI/SignUpForm.jsx`
**Problem:** Rapid double-clicking (or hitting Enter twice) on the sign-up button could fire two concurrent `createUserWithEmailAndPassword` calls, since nothing tracked whether a submission was already in progress.
**Fix:**
- Added `isSubmitting` state in `Signup.jsx`, since that's the component that actually owns the async Firebase call — `SignUpForm.jsx` is presentational and has no way to know when a submission starts or ends.
- `handleSubmitAccountInfoFireBase` now returns immediately if `isSubmitting` is already `true` (the actual programmatic guard — protects against a second `onSubmit` firing before React re-renders the disabled button).
- `isSubmitting` resets in a `finally` block, not just on success, so a failed signup (bad email, network error, etc.) doesn't leave the button stuck disabled forever.
- `isSubmitting` is passed down as a `disabled` prop through `SignUpForm.jsx` to the submit `<Bttn>` (which already spread `...props` onto the native `<button>`, so no changes were needed there) — giving the user visual feedback, not just a silent no-op.

---

## Investigated, Not Yet Fixed

### `key` prop destructured and reused in `FeedCard.jsx`
**File:** `src/pages/BingeLogFeed/Status/FeedCard.jsx`
**Original issue:** The component destructured `key` directly from its own props and reused it (`<main key={key}>`). This never works — React treats `key` as a reserved prop it uses internally for list reconciliation and never actually forwards it into a component's `props` object, so reading it back out is always `undefined`.
**Where it stands:** The `key` destructure was already replaced with a `statusId` variable derived from `status.statusId` — a real field — so the "always `undefined`" version of the bug is gone. However, `key={statusId}` on `<main>` is still a no-op for a different reason: `key` only matters on the element sitting at the top of a `.map()`, and `<main>` here isn't part of any list being reconciled within `FeedCard`'s own render. The actual, meaningful key already lives one level up, on `<FeedCard key={status.statusId} status={status} />` inside the `.map()` in `BingeLogPageAuto.jsx` — which was already correct. The cleanest remaining fix is simply removing `key={statusId}` from `<main>` (and the now-unused `statusId` line) rather than keeping a harmless-but-pointless prop. Not yet applied — pending confirmation.

---

## Notes for Next Session

- The `FeedCard.jsx` key cleanup above is a quick, low-risk follow-up whenever convenient.
- See `BingeLog - Session Bug Fixes -7.14.26.md` for the full prior punch-list pass (11 fixes covering Firebase Analytics init, auth/Firestore race conditions, Firestore query limits, dead Context providers, notes namespacing, and case-sensitive imports) and its general-advice section, which still applies here.
