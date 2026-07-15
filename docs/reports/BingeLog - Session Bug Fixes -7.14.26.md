# BingeLog - Session Bug Fixes -7.14.26

## Overview

This session worked through a punch list of bugs found in the BingeLog codebase, covering Firebase/Auth initialization, Redux state contracts, dead code left over from earlier design iterations, Firestore query limits, and a notes-persistence bug. Below is what changed, why it mattered, and general patterns to watch for going forward. A deeper breakdown of the episode-notes namespacing issue is in its own section since it was the most structurally involved fix.

---

## Fixes Applied

### 1. Firebase Analytics unconditionally initialized
**File:** `src/firebase/firebase.js`
**Problem:** `getAnalytics(app)` ran unconditionally at module load, with no `isSupported()` check or try/catch. In ad-blocked browsers, Safari private mode, or cookie-restricted contexts, this call can throw synchronously.
**Why it mattered:** Because `db` and `auth` were initialized in the same module *after* the analytics call, a throw on that line would abort the whole module — meaning affected users would lose Firestore and Auth entirely, not just analytics.
**Fix:** The `analytics` variable was never used or exported anywhere in the app, so it was deleted outright rather than guarded — dead code with a real failure mode.

### 2. Auth reducer field contract mismatch (`uid` vs `id`)
**Files:** `src/store/slices/authSlice.jsx`, `src/pages/UserPage/Bio/Bio.jsx`, `BioEdit.jsx`, and all live `authActions.login(...)` dispatch sites
**Problem:** The `login` reducer only ever stores `{ uid, email, userName }`. `Bio.jsx` was reading `state.auth.user.id` — a field the reducer never populates — while `BioEdit.jsx` correctly read `.uid`. `userId` in `Bio.jsx` was always `undefined`.
**Fix:** Audited every `state.auth.user` read across the live codebase; all now consistently use `.uid`. The one remaining `.id` reference lives in `src/updated Firebase Functions/updated Firebase Function.jsx`, a draft file not imported anywhere — left untouched by your choice since it has zero effect on the running app.

### 3. Firestore `in` query silently capped at 10 friends
**File:** `src/App.jsx` (hydration effect)
**Problem:** `where("userId", "in", friendsList)` throws if `friendsList` has more than 10 entries — a hard Firestore platform limit (the `in`/`array-contains-any`/`not-in` operators are internally expanded into one equality lookup per value, and Firestore caps how many a single query can fan out into). Because this query lived inside the same `try` block as social-feed and chat-thread hydration, one friend list over 10 would throw, get swallowed by a single `catch` that just logged an error, and silently skip everything after it — while auth/profile/shows data (dispatched earlier in the same block) loaded fine. Result: partial, inconsistent app state with no visible error.
**Fix:** `friendsList` is now split into chunks of ≤10, one `in` query per chunk run in parallel via `Promise.all`, and results merged with `flatMap` before dispatching. Any friend-list size now works.

### 4. Race condition between Firebase Auth and the Firestore user doc
**File:** `src/App.jsx`
**Problem:** `onAuthStateChanged` could fire before a newly-created user's `Users/{uid}` Firestore document existed yet (e.g., during signup, between `createUserWithEmailAndPassword` and the follow-up `setDoc`). The one-shot `getDoc` would find nothing, skip the entire hydration block including `authActions.login`, and the `finally` block still set `hydrated = true` regardless — leaving Firebase reporting "signed in" while Redux reported "logged out."
**Fix:** Added a `waitForUserDoc()` helper using `onSnapshot` that resolves as soon as the doc actually appears, instead of checking once and giving up. A 5-second timeout fallback prevents an indefinitely stuck loading screen if a doc is genuinely never created.

### 5. Dead React Context providers
**Files:** `UserAccountContext.jsx`, `UserProfileContext.jsx` (moved to `OldCode - Tests/`), plus dead imports removed from `UserSearchDropdown.jsx`, `UserList.jsx`, `BioEdit.jsx`, `ShowNotes.jsx`, `Requests.jsx`, `Signup.jsx`, `Login copy.jsx`
**Problem:** Leftover Context API providers from a pre-Firebase/pre-Redux prototype (they called `fetch("http://localhost:3000/...")`, a local JSON-server API). Never mounted anywhere in `main.jsx`. Several live files still imported them, and one (`Requests.jsx`) even called `useContext` on them, though the resulting value was never used.
**Fix:** Moved both context files into the existing `OldCode - Tests/` archive folder via `git mv` (history preserved), and stripped the dead imports/hook calls from every live consumer.

### 6. Orphaned create-account modal wiring
**Files:** `src/components/UI/Signup.jsx`, `src/components/UI/MainNav.jsx`
**Problem:** `Signup.jsx` imported `Modal` and computed `openModal`/`handleCloseModal` from Redux, but never rendered `<Modal>` or referenced either variable — `<SignUpForm>` rendered unconditionally instead. `MainNav.jsx` imported `SignUp` and defined a `toggleCreateAccount` function, but neither was ever used in its JSX.
**Why it mattered less than it looked:** Confirmed the app's real signup/login flow lives on `LandingPage.jsx`, which renders `<SignUp />` and `<Login />` directly and unconditionally — this was leftover from before that redesign.
**Fix:** Removed the unused `Modal`/`openModal`/`handleCloseModal` from `Signup.jsx` and the unused `SignUp` import/`toggleCreateAccount` from `MainNav.jsx`. (Note: `MainNav.jsx` still has an equally orphaned `toggleLogIn` function from the same era — left alone at your request.)

### 7. "Seasons toggle corrupts review state" — investigated, not reproducible
**File:** `src/pages/UserPage/MyShows/MyShows.jsx`
**Finding:** The reported bug described `toggleSeasons()` copy-pasting review-related dispatches (`reviewingShow()`, `toggleReviewing()`). A full-file read and a codebase-wide grep for those exact function/field names turned up zero matches anywhere — `toggleSeasons` and `toggleReview` are both clean one-liners that only touch local `activeTab` state. This punch-list item was stale relative to the current code (likely already cleaned up in an earlier pass, or the report was generated against an older version of the file). No action was needed.

### 8. Episode/character notes not namespaced by show
**File:** `src/pages/UserPage/MyShows/ShowNotes.jsx`
See the dedicated breakdown below — this was the most involved fix of the session.

### 9. Notes wouldn't save unless both note boxes were filled in
**File:** `src/pages/UserPage/MyShows/ShowNotes.jsx`
**Problem:** `saveNotes` computed each note's value as `draftNotes[epTitle] ?? epNotes[showId]?.[epTitle]`. If a box had never been touched (no draft) and the episode had no prior note, this resolved to `undefined`. Firestore's `updateDoc` throws on any `undefined` field value anywhere in the payload — so writing *either* field with an `undefined` value aborted the *entire* write for both `epNotes` and `charNotes` in the same call. The `catch` block only logged the error, but `setAreNotesOpen()` ran unconditionally afterward and closed the panel — making a failed save look like it succeeded.
**Fix:** Both fallback chains now end in `?? ""` instead of leaving the value `undefined`, so the write always contains valid (possibly empty) strings.

### 10. Missing optional-chaining guards / hardcoded array indices
**File:** `src/pages/ShowsSearchPage/ShowsList.jsx`
**Problem:** `showDetails.genres[0]?.name` guarded against a missing *name* but not a missing *genres array itself* — a show with no `genres` field would throw at render. Similarly `showDetails.streamingOptions.us?.map(...)` guarded `.us` but not `streamingOptions` itself.
**Fix:** Genres now use `showDetails.genres?.map(...)` instead of three hardcoded `[0]/[1]/[2]` accesses — one guard instead of three, and it naturally handles any number of genres instead of assuming exactly 3. Streaming options got the missing `?.` on `streamingOptions` itself.

### 11. Case-sensitive import path mismatches
**Files:** `HomePage.jsx`, `LandingPage.jsx` (imported `../../components/auth`, real file `Auth.jsx`); `ShowsPage.jsx`, `UserSearchPage.jsx` (imported `./ShowsPage.Module.css`, real file `ShowsPage.module.css`); `UserSearchBar.jsx` (imported `./userSearchDropdown`, real file `UserSearchDropdown.jsx`); `UserSearchPage.jsx` (imported `./userSearchBar`, real file `UserSearchBar.jsx`)
**Problem:** Windows and macOS filesystems are case-insensitive, so mismatched-case imports resolve fine locally. Linux (most CI runners, Docker builds, and production hosts) is case-sensitive — these exact imports would fail to resolve at build time, with zero warning from local development.
**Fix:** All four import statements updated to match the real on-disk casing exactly.

---

## Deep Dive: Episode Notes Namespacing

This is the fix that changed the actual *shape* of stored data, so it's worth walking through carefully.

### The bug

`epNotes` and `charNotes` (in Redux and Firestore) were flat objects keyed only by episode title:

```js
epNotes = {
  "Pilot": "some note about show A's pilot",
  "The Long Night": "..."
}
```

Almost every TV show's first episode is literally titled "Pilot." Since the key was *only* the episode title, writing a note on Show A's "Pilot" and then opening Show B's "Pilot" read and wrote the exact same `epNotes["Pilot"]` slot — one show's notes silently overwrote the other's, with no error, no warning, just quietly wrong data.

### The fix's shape

The object gained a namespacing layer, keyed by `show.id` first, episode title second:

```js
epNotes = {
  "showAId": {
    "Pilot": "some note about show A's pilot",
    "S1E2 title": "..."
  },
  "showBId": {
    "Pilot": "a completely different note about show B's pilot"
  }
}
```

Same idea for `charNotes`.

### Why the write logic had to change shape, not just add a key

The naive fix would be to just change the key from `epTitle` to `showId` — but that's wrong, because you'd lose per-episode granularity entirely (all of a show's episode notes would collapse into one slot). The actual fix needed **two levels of spreading** to update immutably without destroying sibling data:

```js
const updatedNotes = {
  ...epNotes,                              // keep every OTHER show's notes untouched
  [showId]: {
    ...epNotes[showId],                    // keep every OTHER episode's notes for THIS show untouched
    [epTitle]: draftNotes[epTitle] ?? epNotes[showId]?.[epTitle] ?? "",
  },
};
```

This is the classic pitfall with nested state in Redux/React: **object spread is shallow**. `{ ...epNotes, [showId]: newInnerObject }` only copies the *top* level — if `newInnerObject` isn't itself built from a spread of the existing `epNotes[showId]`, every other episode's note for that show gets wiped out the moment you save one note. The first spread (`...epNotes`) protects other shows; the second spread (`...epNotes[showId]`) protects other episodes within the same show. Skip either one and you reintroduce a different, narrower version of the same "silent overwrite" bug.

### The `undefined` interaction (bug #9 above)

This nested-spread pattern is also exactly what triggered the "won't save unless both boxes are filled" bug: if `draftNotes[epTitle]` is `undefined` (box never touched) *and* `epNotes[showId]?.[epTitle]` is `undefined` (no prior note for that episode), the nullish-coalescing chain resolved to `undefined` — and Firestore's `updateDoc` rejects any payload containing an `undefined` value anywhere, even nested. That's why the final fallback is `?? ""` rather than leaving the chain to potentially resolve to `undefined`: Firestore needs *some* concrete value, even an empty string, for every field it's asked to write.

### A related loose end, not fixed this session

`notesSlice.jsx` initializes `epNotes`/`charNotes` as **arrays** (`epNotes: []`), and `App.jsx`'s hydration defaults to `user.epNotes || []` — but the component code has always treated them as **objects** (`{ ...epNotes }`, bracket access by key). This "works" in practice — spreading an array into an object literal doesn't crash, and array property access with a string key just returns `undefined` rather than erroring — but the moment you save your first note, `epNotes` silently changes type from an array to a plain object in the Redux store. It's a pre-existing shape inconsistency that predates this session's changes and isn't currently causing failures, but it's worth cleaning up (initialize as `{}` instead of `[]`) if you're back in this file.

### Why the fix needed `show.id`, not `showTitle`

`ShowNotes.jsx` originally only received `showTitle` as a prop — not enough to safely namespace by, since two different show entries could theoretically share a title. The caller (`EpisodeDetails.jsx`) was already passing the full `show` object down, so the fix pulled `show.id` out of that existing prop rather than threading a new one through — `show.id` is the same identifier already used elsewhere in the app (`MyShows.jsx`, Firestore doc updates) as the canonical per-show key.

---

## General Advice to Avoid These Classes of Bugs

**1. Redux slice contracts — pick one field name and enforce it everywhere.**
The `uid`/`id` mismatch happened because different files were written at different times without a shared source of truth for "what does `state.auth.user` look like." When you add a new field to a slice's state, grep for every `useSelector` that reads that slice before assuming a rename or restructure is safe.

**2. Firestore has hard platform limits — know them before you hit them in production.**
`in`, `array-contains-any`, and `not-in` all cap at 10 values because Firestore expands them into that many separate equality lookups internally. Any time you're building a query array from user-controlled data (friend lists, tag lists, etc.), assume it can exceed 10 and chunk proactively rather than reactively.

**3. Firestore rejects `undefined` anywhere in a write payload — always default to `null` or `""`.**
This bit twice in different forms this session (the notes save, and worth double-checking anywhere else `updateDoc`/`setDoc` is called with optionally-empty form data). A single `undefined` deep in a nested object aborts the *entire* write, not just that field.

**4. One-shot reads racing against async writes — prefer listening over polling once.**
`getDoc` only sees a snapshot in time. If your data can be created moments after a listener fires (auth state changing before a Firestore doc is written), a single `getDoc` is a race condition by construction. `onSnapshot` (with a bounded timeout to avoid infinite loading states) reacts to the data actually becoming available instead of gambling on timing.

**5. Nested state updates need a spread at every level you're descending into.**
`{ ...outer, [key]: newInner }` only protects siblings of `key` at the outer level. If `newInner` itself needs to preserve existing nested data, it needs its own `{ ...outer[key], ... }` spread. This is worth a mental checklist any time state gains a new level of nesting (which is exactly what happened going from flat `epNotes` to `epNotes[showId][epTitle]`).

**6. Dead code accumulates fastest around design pivots — audit it when you notice the seams.**
The Context API providers, the modal-gated signup wiring, and the `updated Firebase Functions` draft file are all artifacts of the app moving from a local JSON-server prototype → Context API → Redux + Firebase, and from a modal-based auth flow → a landing-page-based one. None of it was actively harmful until this session's audit, but each pivot left orphaned imports and unused functions behind. A quick grep for "is this actually rendered/called anywhere" after a redesign catches this before it accumulates.

**7. Case-sensitive imports are invisible until deploy — consider linting for them.**
Since Windows/macOS won't ever surface this locally, it's worth either (a) getting in the habit of matching import casing to the real filename exactly as a rule of thumb, or (b) adding an ESLint rule (e.g. `import/no-unresolved` with `caseSensitive` options, or a Vite plugin like `vite-plugin-checker` configured for case sensitivity) so it's caught before a Linux deploy fails on it.

**8. Guard the *container*, not just the leaf.**
`obj.arr[0]?.prop` protects `prop` but not `arr` itself. When adding optional chaining, guard from the outermost uncertain level inward (`obj.arr?.[0]?.prop`), and prefer `.map()` over hardcoded indices when the data's length isn't guaranteed — it collapses "guard against missing array" and "guard against wrong assumed length" into a single fix.
