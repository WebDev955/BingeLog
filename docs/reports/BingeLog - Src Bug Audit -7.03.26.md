# BingeLog - Src Bug Audit -7.03.26

Full read-through of every file under `src/`, split across six parallel review
passes (auth/context/login, UI components + hooks, Redux store + Firebase,
BingeLogFeed pages, UserPage pages, Home/search/friends pages). Findings
below are deduplicated and grouped by severity. Line numbers refer to file
state as of this audit and may drift as the code changes.

## High severity

1. **`src/components/Auth.jsx:20-26` — Sign-out causes infinite recursion.**
   A local `const signOut = async () => { ... await signOut(auth) ... }`
   shadows the imported Firebase `signOut`. Every call recurses into itself,
   throwing `RangeError: Maximum call stack size exceeded` instead of ever
   signing the user out. **Sign-out is completely broken app-wide.**

2. **`src/pages/BingeLogFeed/BingeLogPage.jsx:37` — Manual feed tab is dead.**
   `{feedType === "auto" ? <BingeLogPageAuto /> : "Manual Statuses"}` — the
   imported `BingeLogPageManual` is never rendered. Clicking "View Manual
   Updates" just shows the literal string "Manual Statuses".

3. **`src/pages/BingeLogFeed/Status/Comments/ReplyComment.jsx` — Replies never reconcile into state.**
   Two independent mismatches: `CommentChats2.jsx` passes `status={status}`
   but `ReplyComment.jsx` destructures `statusId` (always `undefined`), and
   the dispatched payload key `newReply` doesn't match what
   `chatsSlice.jsx`'s `updateReplies` reads (`reply`). A posted reply writes
   to Firestore but silently never appears in the UI. Fixing only the
   `statusId` half without the payload-key half will crash on
   `comment.replies.push(undefined)`.

4. **`src/pages/BingeLogFeed/BingeLogPageManual.jsx:28` — Wrong prop passed to `FeedCard` (latent, masked by #2).**
   Passes `friend={friend}` but `FeedCard` expects `status` and immediately
   reads `status.statusPost.currBinging`. Will crash the moment the manual
   feed tab (#2) is fixed and this renders.

5. **`src/pages/UserPage/MyShows/ShowReview.jsx:59` — Crash on first review of any show.**
   `savedReview` is `undefined` for shows with no existing review, but line
   59 immediately does `<div key={savedReview.id}>`. Opening the review
   panel on any not-yet-reviewed show — the normal first-time flow — throws
   and crashes the component tree.

6. **`src/pages/UserPage/MyShows/MyShows.jsx:254` / `handleSelectShow` (33-39) — Seasons/Episodes toggle is inverted and broken.**
   The render check tests `displaySeasons` truthiness instead of
   `displaySeasons === show.id`, and `handleSelectShow` sets it as soon as
   any show is opened — before the "Seasons & Episodes" control is ever
   clicked. First click on that control then collapses it instead of
   showing it.

7. **`src/components/UI/Modal.jsx` used incorrectly in `src/components/LoginLogOut/Login.jsx:82`.**
   `Modal` expects a `handleClose` prop; `Login.jsx` passes `onClose=` instead.
   Dismissing the native `<dialog>` (e.g. Escape key) never dispatches
   `stopLoggingIn()`, desyncing Redux from the visible modal state.

8. **`src/components/UI/FileUploader.jsx:28,34-46,63,74` — Broken loading state + no error handling.**
   `setStatus("Uploading")` (capital U) vs. checks for lowercase
   `"uploading"` — the progress UI never renders and the Upload button never
   hides, allowing duplicate uploads. The `axios.post(...).then()` chain has
   no `.catch()`, so network failures leave the UI stuck with no error shown.

9. **`src/pages/UserSearch/UserList.jsx:45` and `UserSearchDropdown.jsx:49` — Adding a friend never updates Redux.**
   `addFriend()` computes the correctly-updated array but dispatches the
   **old** `friendsList` instead of `updatedFriendsList`. The new friend
   doesn't appear until a full reload re-hydrates from Firestore.

10. **Same files/functions — no duplicate-friend guard, causing data loss.**
    Because Redux's copy of `friendsList` never advances in-session (#9), a
    second "Save User" click in the same session overwrites Firestore from
    the same stale snapshot, silently dropping a friend added earlier in
    that session.

11. **`UserList.jsx:58` and `UserSearchDropdown.jsx:72` — Broken profile links.**
    `to={`/userPage/:${userDetails.id}`}` has a stray literal `:` — the
    route is `userPage/:uid`. Clicking a searched user's profile link never
    navigates anywhere.

12. **`src/pages/ShowsSearchPage/SearchDropdown.jsx:14-19` — Show-detail panel collapses instead of switching shows.**
    `setSelectedShow(show)` is immediately followed by a check against the
    stale pre-update `selectedShow` closure value, which then collapses the
    panel. Once a show is expanded, clicking a different show closes the
    panel instead of switching to it — requires a second click.

13. **`src/pages/UserSearch/UserSearchBar.jsx:13-35` — No debounce on user search.**
    Fires a full Firestore collection read on every keystroke (unlike
    `ShowSearchBar.jsx`, which does debounce). Expensive, and out-of-order
    responses can overwrite newer results.

## Medium severity

14. **`src/firebase/firebase.js:27` — Unconditional `getAnalytics(app)` can take down auth/Firestore.**
    No `isSupported()` check or try/catch. Throws in ad-blocked/Safari
    private-browsing/cookie-restricted environments, and since `db`/`auth`
    are initialized in the same module afterward, the whole module fails to
    load for those users.

15. **Contract mismatch: `authSlice.jsx:32`'s `login` reducer expects `{ uid, email, userName }`, but session-restore/hydration code elsewhere dispatches without `uid`** (seen in the dead scratch file, but documents a real intended contract other code relies on — e.g. `Bio.jsx` vs `BioEdit.jsx`, see #23 below).

16. **`src/App.jsx:96-142` — Firestore `"in"` query silently caps at 10 friends.**
    `where("userId", "in", friendsList)` throws for users with more than 10
    friends; the single outer `catch` swallows it with just a
    `console.error`, leaving socialFeed and chats hydration silently skipped
    while other slices already succeeded — partial, inconsistent state.

17. **`src/App.jsx:56-149` — Race condition between auth creation and Firestore doc hydration.**
    If `onAuthStateChanged` fires before a new user's `Users/{uid}` doc
    exists, `authActions.login` never dispatches but `hydrated` is still set
    `true` — Firebase reports signed-in while Redux still thinks logged-out.

18. **`src/components/Contexts/UserAccountContext.jsx` / `UserProfileContext.jsx` — Providers never mounted.**
    Not rendered anywhere in `main.jsx`/`App.jsx`/`RootLayout.jsx`, yet
    several files still `useContext(...)` them (`Requests.jsx`,
    `UserSearchDropdown.jsx`, `UserList.jsx`, `BioEdit.jsx`, `ShowNotes.jsx`)
    and silently get no-op defaults.

19. **`src/components/UI/Signup.jsx` — Create-account modal is wired to nothing.**
    `Modal`, `openModal`, `handleCloseModal` are derived but never used;
    `SignUpForm` renders unconditionally outside any `Modal`. `MainNav.jsx`'s
    `toggleCreateAccount` is also never attached to any element. The
    modal-gated signup feature does nothing end-to-end.

20. **`src/hooks/hooks.jsx:16,18` and `FileUploader.jsx:16` — Unguarded `state.auth.user.uid`/`.userName` access.**
    If `user` becomes `null` (e.g. logging out while these components are
    still mounted), the selector throws and crashes that subtree.

21. **`src/pages/BingeLogFeed/Status/Comments/LeaveComment2.jsx:24-26,86-89` — Placeholder text can be posted as a real comment.**
    `commentDraft` is initialized to the hint string `"Write a comment on
    this status"` instead of `""`, with no controlled `value` on the
    textarea. Submitting without typing posts the literal placeholder.

22. **`src/pages/BingeLogFeed/BingeLogPageAuto.jsx:27-32` — "Username" sort doesn't sort by username.**
    `handleStatusUserNameSort` sorts by `a.userId.localeCompare(b.userId)`,
    not a display-name field, producing an order unrelated to alphabetical
    username.

23. **`src/pages/UserPage/Bio/Bio.jsx:44` vs `BioEdit.jsx:25` — Mismatched user-id field.**
    `Bio.jsx` reads `state.auth.user.id`; `authSlice`'s `login` reducer only
    ever stores `{ uid, email, userName }` — there is no `.id`, so
    `userId` in `Bio.jsx` is always `undefined`.

24. **`src/pages/UserPage/MyShows/MyShows.jsx:41-48` — `toggleSeasons` corrupts review-panel state.**
    Copy-pasted dispatches from `toggleReview` (`reviewingShow()` with no
    payload, `toggleReviewing()`) run whenever Seasons/Episodes is opened,
    resetting `reviewingShowId` and flipping the global `isReviewing` flag
    as a side effect.

25. **`src/pages/UserPage/MyShows/ShowNotes.jsx:92-116` — Episode notes keyed only by episode title.**
    `epNotes`/`charNotes` use `{ [epTitle]: text }` with no show
    namespacing. Two different shows with a same-titled episode (e.g.
    "Pilot") will silently overwrite each other's notes.

26. **`src/pages/UserPage/Bio/BioEdit.jsx:36-49` — Redux updates regardless of Firestore write success.**
    `dispatch(...)` is evaluated eagerly while building `updateDoc`'s
    argument list (an invalid 3rd argument), with no `try/catch`. UI and DB
    go out of sync silently on any write failure.

27. **`src/pages/ShowsSearchPage/ShowSearchBar.jsx:12-37` — Race condition on out-of-order API responses.**
    Debounce prevents overlapping timers but not overlapping in-flight
    fetches; no `AbortController`/staleness guard, so a slower earlier
    response can overwrite fresher results.

28. **`src/pages/ShowsSearchPage/ShowsList.jsx:78,91` — Inconsistent optional chaining.**
    `showDetails.genres[0]?.name` has no guard on `genres` itself, and
    `showDetails.streamingOptions.us?.map(...)` has no guard on
    `streamingOptions`. Shows missing either field (plausible from an
    external API) throw at render.

29. **Case-mismatched imports that will fail on case-sensitive filesystems (Linux CI/deploy hosts), even though they resolve fine on Windows/macOS:**
    - `LandingPage.jsx:5` / `HomePage.jsx:5` import `../../components/auth` (real file: `Auth.jsx`)
    - `ShowsPage.jsx:7` / `UserSearchPage.jsx:6` import `./ShowsPage.Module.css` (real file: `ShowsPage.module.css`)
    - `UserSearchBar.jsx:4` imports `./userSearchDropdown`, `UserSearchPage.jsx:3` imports `./userSearchBar` (real files capitalized)

## Low severity

30. **`src/pages/BingeLogFeed/Status/FeedCard.jsx` — `key` prop destructured and reused.**
    React never forwards `key` into `props`, so `<main key={key}>` always
    uses `undefined` — silently does nothing.

31. **`src/components/UI/SignUpForm.jsx:12-32` vs `Input.jsx:6,10` — Wrong prop name.**
    `SignUpForm` passes `htmlFor="username"` but `Input` expects `attribute`;
    labels never focus their inputs when clicked.

32. **`src/components/UI/Signup.jsx:62-77` — No double-submit guard** on account creation; rapid double-click fires two concurrent signups.

33. **`src/pages/UserPage/Bio/Bio.jsx:61` — Share link never interpolates.**
    `href="http://localhost:5173/userPage/${userId}"` uses a plain string,
    not a template literal — always points to the same broken hardcoded URL.

34. **`src/pages/UserSearch/UserSearchDropdown.jsx:75` — Wrong key field.**
    `key={user.uid}` on Firestore user objects that only have `.id`, not
    `.uid` — always `undefined`, causing React key warnings and unreliable
    list reconciliation.

35. **`src/pages/FriendsList/Requests.jsx` — No functionality implemented.**
    Renders a static "Friend Requests" heading only; no fetch/accept/decline
    logic exists.

## Dead / scratch code (not live bugs, but worth cleaning up)

- **`src/components/LoginLogOut/Login copy.jsx`** — not imported anywhere; a
  leftover duplicate using a legacy `localhost:3000` REST login flow instead
  of Firebase. Safe to delete.
- **`src/components/AddFriend.jsx`** and **`src/components/Contexts/authContext.jsx`** — both empty (0-byte) files.
- **`src/code test playground/AutoStatusTests.jsx`** — scratch file combining
  several unrelated components with duplicate imports and multiple
  `export default` statements; would not compile if ever actually imported.
- **`src/updated Firebase Functions/updated Firebase Function.jsx`** — calls
  `useDispatch()` at module top level (outside any component), has duplicate
  function declarations, and references dozens of undefined variables.
  Not wired into the live app.
- **`src/components/UI/ShowStatus.jsx`** — unimplemented placeholder stub.

## Not audited in depth (no bugs found)

`src/main.jsx`, `src/components/LoginLogOut/LogInForm.jsx`,
`src/components/LoginLogOut/Login.jsx` (aside from #7), `Bttn.jsx`,
`Footer.jsx`, `Input.jsx` (aside from #31), `MainNav.jsx` (aside from #19),
`RootLayout.jsx`, `TextContent.jsx`, `store.jsx`, `chatsSlice.jsx`,
`friendsSlice.jsx`, `notesSlice.jsx`, `profileSlice.jsx`, `showsSlice.jsx`,
`socialFeedSlice.jsx`, `ActionBar.jsx`, `CommentChats2.jsx`,
`CurrentlyWatching.jsx`, `MyReviews.jsx`, `ShowDetails.jsx`,
`EpisodeDetails.jsx`, `HomePage.jsx`, `LandingPage.jsx`, `About.jsx`,
`FriendsList.jsx` (downstream of #9 only).
