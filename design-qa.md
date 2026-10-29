# Design QA — MachaPortfolio

final result: blocked

Source visual truth: `/workspace/scratch/9a847c28b042/generated_images/exec-237fd590-b222-4e5c-905c-d9c38134692b.png` (1435 × 1096 pixels).
Implementation route: managed preview at terminal.local port 4173.
State: public homepage, anonymous. Browser CSS viewport has not been normalized because content rendering is blocked.
Implementation screenshot path: unavailable; no matching rendered homepage capture was possible.
Full-view comparison evidence: unavailable. The browser rendered the application's recoverable content-load error page, not the intended public homepage.
Focused comparison evidence: unavailable for the same reason.

## Findings

- [P0 verification blocker] The managed preview server cannot fetch the Supabase API (`TypeError: fetch failed`). Browser logs show the server-side `getPublicContent` failure. The identical Supabase anonymous read succeeds in the development shell and returns one profile row with no error. Build and database tests do not count as visual verification.
- Owner login and dashboard end-to-end browser verification remain blocked. The actual owner Auth account has not been created and `OWNER_USER_ID` is intentionally empty. There is no default administrator or auth bypass.

## Required fidelity surfaces

- Fonts/typography: implementation uses locally hosted DM Serif Display and DM Sans, but rendered wrapping and optical matching are unverified.
- Spacing/layout: responsive hero, portrait and three compact bio cards implemented; desktop/mobile composition unverified.
- Colors/tokens: matcha `#b4c594`, obsidian `#141a14`, translucent glass; contrast and visual balance unverified in browser.
- Image quality: generated portrait, orb and project illustration assets are present. Cropping, rendered sharpness and placement remain unverified.
- Copy/content: public content comes from the live database. Demo portrait and project-concept labels implemented. Project description identifies MBG Report as a school competition prototype. The mock's incorrect “mahasiswa” label is intentionally corrected to “pelajar”.

## Functional checks completed

- Next.js production build succeeded.
- TypeScript check succeeded.
- Four input/authorization unit tests passed.
- Live Postgres transactional RLS checks passed: anonymous profile read; draft hiding; non-owner update and insert denial; no self-enrollment; owner profile/project updates; owner storage insertion. All fixtures rolled back.
- Supabase security advisors reported no findings.
- Anonymous SDK call from the development shell returned profile successfully.

## Browser checks and gaps

- Public preview opened in the cloud browser but displayed content-load error.
- Console inspected: application error is the backend fetch failure. Extension metadata errors are unrelated browser-extension messages.
- Primary navigation, project detail, contact links, mobile menu, reduced motion, upload and owner CRUD have not been verified in the rendered browser.
- No screenshot comparison iteration or pass is claimed.

## Next verification steps

1. Run on a Next.js environment with working Supabase egress.
2. Provision the owner's Auth account and membership, set `OWNER_USER_ID`.
3. Capture the same desktop viewport as the source plus 390px and 768px responsive views.
4. Compare full view and hero/card crops against the source; fix P0/P1/P2 deviations.
5. Verify public project route, navigation, login rejection, owner CRUD/upload, draft privacy and reduced motion. Check browser console again.
