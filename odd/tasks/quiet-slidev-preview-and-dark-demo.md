# Quiet Slidev preview and dark Archify demo

## Objective
Simplify the clickable Archify preview and make the embedded demo viewer match the presentation's dark visual theme, without weakening accessibility or changing the static/PDF preview.

## Problem and why
The Slidev preview has an overlaid “Explore diagram” badge although its image already uses a zoom cursor. The opened viewer also follows the browser's light preference instead of matching the dark slide. README/site copy currently promises a visible badge.

## Scope
- Remove the unconditional visual badge while preserving the native button, accessible label, focus state, zoom cursor, and no-preview text fallback.
- Set the example slide's viewer URL to Archify's supported `theme=dark&embed=1` mode.
- Update README and the component-site API description.
- Add regression checks for no badge, zoom cursor, accessible activation, and both viewer query parameters.
- Do not modify the standalone generated Archify HTML; it already handles these parameters.

## Constraints
- All repository-authored text is English.
- Conventional Commits; one PR closes issues #30 and #31. Merge via ordinary protections; no admin bypass.
- Work in this new Git worktree based on `origin/main` (initial commit `0add8f5`).
- Keep the visual affordance minimal; do not add a prop just to hide an unconditional badge.
- TDD mode: test-first, selected by the user in this session. Runner: `npm run test:component`.
- RDD mode: unable to query because `gentle-ai` is not installed on PATH; if work-unit review is due, report assessment unavailable and do not fabricate a review.

## Authorized scope
Create issues in `svg153/slidev-archify-explorer`, implement in this worktree, commit on the feature branch, push, open a PR, and merge under ordinary repository protections. No security bypass.

## Tasks

### T1 — Remove visible preview badge and correct docs
- [x] Remove badge markup and obsolete CSS.
- [x] Update README and website API copy.
- [x] Add test assertions that the badge is absent while the native button remains labelled, keyboard operable, and shows `zoom-in` cursor.
- **Route:** delegated direct implementation (writer trigger: behavior/tests/docs span 2+ non-trivial files; mapping trigger satisfied by read-only Luna exploration).
- **Verification:** `npm run test:component`, `npm run build`, `npm run build:pages`, `npm run test:pages`.

### T2 — Match embedded demo viewer to dark slide
- [x] Append `?theme=dark&embed=1` to the example viewer URL.
- [x] Assert the iframe URL preserves both query parameters; visually verify the opened viewer is dark and embed chrome is minimized.
- **Route:** same delegated implementation slice as T1 because changes share the same component/demo experience and CI test file.
- **Verification:** component browser test, build and export checks; inspect the embedded public-demo equivalent after local verification.

## Forecast and delivery
- Forecast: under 150 authored changed lines, generated files excluded.
- Strategy: `ask-on-risk` (default); one focused PR for both issues.

## Progress and evidence
- Mapping delegated read-only to Luna worker `01a0ea09-ee8c-7dc1-8118-82c86b554f97`; completed findings identify component, slide, README, site API table, and test script.
- Issues created: #30 (preview badge) and #31 (dark embedded viewer).
- Worktree: dedicated clean checkout, branch `codex/quiet-preview-dark-demo`, based on `origin/main`.
- TDD resolved: test-first selected by user; runner `npm run test:component`.
- RED observed: `npm run test:component` failed on the new badge-absence assertion before implementation.
- GREEN/checks reported by Luna: `npm run test:component`, `npm run build`, `npm run build:pages`, `npm run test:pages`, and `npm run export` all passed; export emitted existing non-fatal FloatingVue/Wake Lock console warnings.
- Visual verification: local Slidev opened the dialog at `/1`; verified preview has no badge, iframe URL is `?theme=dark&embed=1`, and the rendered Archify diagram uses the dark palette with compact embed chrome.
- Work-unit commits: `8b3161a` (T1, `fix(explorer): remove preview badge`); `798f180` (T2, `feat(demo): use dark embedded Archify viewer`).
- RDD/native review assessment remains pending: `gentle-ai` is unavailable in this environment; do not merge until the repository's enabled review gate can be assessed and satisfied.
- Next: verify review assessment availability, then push and open the single PR closing #30 and #31. Merge only if ordinary protections and the applicable review gate permit it.

