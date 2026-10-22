# How the explorer works

```text
Slidev slide
  ├─ static Archify SVG ───────────────> normal slide and PDF
  └─ ArchifyExplorer button ─> dialog ─> standalone Archify HTML viewer
```

The Vue component opens and closes a native dialog. The interactive diagram remains the standalone HTML produced by Archify, hosted under Slidev's `public/` directory and loaded in a titled iframe. In print mode, Slidev omits the dialog and button; the static SVG remains in the slide.

When rendered in Slidev presenter mode, the component publishes only `{ deck, session, component, slide, open, focus }` over the narrowly named `slidev-addon-archify-explorer` same-origin `BroadcastChannel`. The audience validates the message shape, rejects mismatched origin/source metadata when present, checks deck/session/component scope and slide number, and accepts presenter-direction messages only before opening or closing its local dialog. A same-origin iframe observer reads Archify's `svg[data-focus-active]` state and mirrors a focused node through the iframe hash; no notes, slide markup, or page content is sent. `sync-key` disambiguates repeated explorers on one slide.

The default session boundary is the current origin, Slidev base path, and deck title. A deck that runs concurrent rooms on the same deployment can pass the same explicit `sync-session` value to its presenter/audience pair and a different value to other rooms. Separate deployments or deck titles do not share messages; the channel remains local to the browser origin. Same-origin access is required only for focus mirroring. If a custom diagram is cross-origin, it remains usable locally but cannot participate in presenter focus sync.

This split keeps the slide lightweight, avoids embedding a second SVG renderer into Vue, and preserves a predictable PDF export.
