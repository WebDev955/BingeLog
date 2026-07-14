# BingeLog - Src Folder Organization Review -7.03.26

Quick pass over `src/` file and folder names to spot things worth
reorganizing later. Based on naming/structure only — not yet verified
against actual imports/usage.

## Inconsistent naming
- `src/components/LoginLogOut/Login copy.jsx` — looks like a stray duplicate of `Login.jsx` (space in filename too).
- `src/updated Firebase Functions/updated Firebase Function.jsx` — spaces in folder/file name, sits at `src/` root instead of near `src/firebase/`.
- `src/code test playground/AutoStatusTests.jsx` — spaces in folder name, reads like a scratch/test file that doesn't belong alongside real source.

## Folders sitting oddly outside the pattern
- `src/firebase/firebase.js` and `src/updated Firebase Functions/` are two separate Firebase-related locations — likely should be merged into one folder.
- `src/hooks/hooks.jsx` — a single file named the same as its folder; fine for now but generic.

## Mixed grouping under `components/`
- `components/Auth.jsx` and `components/AddFriend.jsx` sit loose at the top level, while everything else is nested (`LoginLogOut/`, `UI/`, `Contexts/`).
  - `Auth.jsx` maybe belongs in `Contexts/` or its own `Auth/` folder next to `LoginLogOut/`.
  - `AddFriend.jsx` looks related to `FriendsList` (under `pages/`) rather than `components/`.
- `components/UI/` mixes generic primitives (`Bttn.jsx`, `Modal.jsx`, `Input.jsx`, `Footer.jsx`) with page-scaffolding (`SignUpForm.jsx`, `Signup.jsx`, `RootLayout.jsx`, `MainNav.jsx`).
- Possible near-duplicate pair: `Signup.jsx` and `SignUpForm.jsx` both live in `components/UI/` — worth checking if one is dead weight.

## Naming collisions across `pages/`
- `pages/UserSearch/{ShowSearchBar,ShowsList,ShowsPage}.module.css` are literally named after Shows components, not User components — strong signal of copy-paste-and-forget-to-rename from `pages/ShowsSearchPage/`.
  - Confirmed: `UserSearchBar.jsx` imports `./ShowSearchBar.module.css` (wrong name, but currently wired up and in use).
  - `ShowsList.module.css` and `ShowsPage.module.css` in `UserSearch/` appear orphaned (no corresponding jsx imports them there).

## Next steps (deferred)
- Verify which of the suspicious files (`Login copy.jsx`, playground file, orphaned CSS) are actually dead vs. still referenced, via import grep.
- Decide on a target structure and move files + fix imports.
