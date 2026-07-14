# BingeLog - Src Completion Punch List -7.07.26

**Date:** 2026-07-07
**Purpose:** Not a bug list (see [BingeLog - Src Bug Audit -7.03.26](<BingeLog - Src Bug Audit -7.03.26.md>) for that). This is a survey of unfinished features, in-progress work, and cleanup items across `src/` — the stuff standing between "functional" and "finished."

## 1. Finish the CSS redesign migration

The [BingeLog - UserPage CSS Redesign -7.04.26](<BingeLog - UserPage CSS Redesign -7.04.26.md>) pattern (new `*UPDATE.module.css` file + commented-out original import) is applied consistently across 18 files total — the 10 originally scoped in `UserPage/` plus 8 more in `BingeLogFeed/` that were done the same way but never got their own report. Nothing was missed or double-migrated.

What's actually left:
- **Decide and commit.** Once you're happy with the new styles, delete the 18 old `.module.css` files and the 18 dead commented-out import lines. Right now every one of those JSX files carries a stale import line as debris.
- **Document the `BingeLogFeed/` half.** The `UserPage/` redesign has a report explaining the reasoning (palette, spacing scale, badge pattern); the `BingeLogFeed/` redesign (ActionBar, CommentChats2, LeaveComment2, ReplyComment, FeedCard, and the three BingeLogPage variants) doesn't, so there's no record of whether the same open items (no design-token file, no contrast audit) apply there too.
- **Optional next step:** promote the repeated radius/shadow/spacing literals into `:root` CSS variables in `index.css` instead of copy-pasted values across 18 files — the redesign report already flags this as the natural follow-up.

## 2. Dead code and leftover files

Low-risk cleanup, mostly delete-and-done:
- `src/components/AddFriend.jsx`, `src/components/Contexts/authContext.jsx` — empty (0-byte) files.
- `src/pages/BingeLogFeed/Status/Comments/CommentChats.module.css` — empty; the live component is `CommentChats2.jsx`, this looks like a v1 leftover.
- `src/components/LoginLogOut/Login copy.jsx` — unused duplicate using a legacy REST login flow instead of Firebase.
- `src/code test playground/AutoStatusTests.jsx` — scratch file, wouldn't even compile if imported (duplicate imports, multiple default exports). Also still references the pre-redesign `.module.css` files directly, which is another reason to clear it out before deleting those.
- `src/updated Firebase Functions/updated Firebase Function.jsx` — scratch file, not wired into the app.
- **49 leftover `console.log` calls across 20 files** — worth a sweep before calling this shippable. Notable spots: `UserList.jsx:25`, `UserSearchDropdown.jsx:34,57`, `FriendsList.jsx:35`.

## 3. Features that are stubbed or half-wired

- **`ShowStatus.jsx`** (`src/pages/UserPage/MyShows/`) — literal placeholder content (`Show Status Here`, with a typo — "Finsihed"). It's imported into `MyShows.jsx` but never actually rendered, so it's a dead stub rather than a live half-feature.
- **`Requests.jsx`** (`src/pages/FriendsList/`) — friend requests page is just a heading; no fetch/accept/decline logic exists yet. If friend requests are meant to be part of the friends flow (vs. the current direct-add), this is the gap.
- **Signup modal** (`src/components/UI/Signup.jsx`) — the modal wiring (`Modal`, `openModal`, `handleCloseModal`) is built but never connected; the nav's toggle handler isn't attached to anything either. Right now sign-up form just renders unconditionally rather than opening in a modal as designed.
- **`UserAccountContext` / `UserProfileContext`** — both are consumed (`useContext`) in several components (`Requests.jsx`, `UserSearchDropdown.jsx`, `UserList.jsx`, `BioEdit.jsx`) but the providers are never mounted anywhere, so they're silently getting no-op defaults. Either mount them or remove the dead `useContext` calls.

## 4. Known profile-click bug — where it lives

You mentioned this one already, so just for reference when you get to it: it's duplicated in **two** places, not one — `src/pages/UserSearch/UserList.jsx:58` and `src/pages/UserSearch/UserSearchDropdown.jsx:72` both build the profile link as `` `/userPage/:${id}` `` (stray literal colon) against a route defined as `userPage/:uid`. These two files are near-duplicates of each other (same `addFriend` logic, same console.logs, same bug) — worth consolidating into one shared component so this class of "fixed in one place, still broken in the other" issue stops recurring.

## 5. Smaller polish gaps

- No loading spinners or in-UI error banners anywhere sampled (search, friend-add, show-status) — failures currently just `console.log` or `alert`.
- Case-mismatched imports (e.g. `../../components/auth` vs. real file `Auth.jsx`) will resolve fine on Windows/Mac but break on a case-sensitive Linux deploy target — worth a pass before deploying anywhere other than local dev.

---
*Source project: BingeLog (`C:\Users\Austin\Desktop\WebDesign\BingeLogRemixDeluxe - Redux - GitHub\BingeLog`)*
