# Presenter-triggered explorer sync

## Objective and authorization

Implement the shared addon portion of roadmap issue #8 in the isolated worktree on `codex/presenter-explorer-sync`. Presenter-triggered Archify explorer open, focus, and close state should mirror to the audience without exposing presenter notes or slide content.

## Scope

- Update `components/ArchifyExplorer.vue` with narrowly scoped presenter/audience synchronization.
- Extend `scripts/test-component.mjs` with two-context browser coverage for open/close, focused-node propagation, and isolation.
- Update the minimal README/architecture documentation needed to explain the sync contract and standalone/print behavior.

## Constraints

- Work only in this isolated worktree; do not touch the existing `slidev-archify-explorer` checkout.
- Preserve standalone use, native dialog accessibility, Escape/focus return, slide-navigation clearing, and print/PDF fallback.
- Use Slidev 53 public APIs where suitable; do not broadcast notes or page content.
- Validate sync messages and scope them to deck/session/component. No secrets, remote credentials, push, publish, PR, or merge.
- TDD is not enabled; use normal focused checks.

## Route and task checklist

- [x] T1 — Implement and verify presenter explorer sync, tests, and minimal docs.

## Acceptance criteria and checks

- Presenter actions mirror to the matching audience component: open, focused node, and close.
- Focus/visibility state is cleared on slide navigation and unrelated deck/session/component traffic is ignored.
- Malformed or mismatched-scope messages are ignored. Same-origin scripts are part of the trusted origin boundary; BroadcastChannel is not sender authentication.
- Existing standalone accessibility and print behavior remain intact.
- Run `npm run test:component`, `npm run build`, and any relevant npm test scripts; report exact results.
- Forecast authored changes: under 400 lines; one focused work-unit commit expected.

## Progress

- Route: delegated direct for the isolated shared-addon behavior; parent owns integration, review and remote actions.
- TDD: disabled/not explicitly enabled; normal checks.
- Verification: `npm run test:component` passed with one shared BrowserContext for presenter/audience, a second isolated context, open/focus/close propagation, invalid scope rejection, and slide-navigation clearing. `npm run build`, `npm run build:pages`, `npm run test:pages`, and `npm run export` passed; `pdfinfo archify-explorer-demo.pdf` reports 2 pages. Export logs an existing FloatingVue/Popper console error but still completes successfully.
- Session decision: add an optional explicit `sync-session` prop for concurrent same-origin deck instances; keep the origin/base/title fallback for backward compatibility.
- Independent review found cross-origin iframe access could throw during focus observer setup, malformed-message coverage used an unrelated component scope, and navigation used a page reload. The follow-up makes observer access exception-safe, derives the test session from `SLIDEV_URL`, rejects malformed messages on the matching component, and uses Slidev's client-side `nav.go` for navigation. Same-origin BroadcastChannel is documented as coordination, not authentication.

## Accomplished

- Added validated presenter-to-audience BroadcastChannel state for open, focused node, and close.
- Preserved standalone dialog behavior, Escape/focus return, same-origin iframe focus observation, and print/PDF fallback.
- Added explicit `sync-key` and `sync-session` escape hatches for repeated components and concurrent rooms.
- Added shared/isolated browser-context coverage and minimal README/architecture documentation.

## Evidence

- Work-unit commit: `2587850` (`feat(explorer): sync presenter exploration state`).
- Follow-up commits: `acd24aa` (verification record), `26b3bf6` (integration status). Parent correction batch is pending its commit.
- Risk: item 1 — BroadcastChannel delivery remains same-origin and same-browser-profile; cross-origin diagrams stay standalone and cannot mirror focus.
- Risk: item 2 — default session fallback cannot distinguish concurrent identical deployments; use explicit `sync-session` for that case.
- Risk: item 3 — same-origin BroadcastChannel is not sender authentication; documentation now identifies the same-origin code trust boundary. The payload contains only explorer open/focus state.
- Engram mirror: pending because the host has not registered an authoritative runtime session identity; no unassociated memory write was made.
- Independent verification reviewed the first implementation, requested bounded fixes, then passed the corrections with no remaining blockers.

## Next step

Parent commits the bounded corrections, opens the addon PR, waits for CI and merges it; after release, consume it from the presentation branch.
