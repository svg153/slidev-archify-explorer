# How the explorer works

```text
Slidev slide
  ├─ static Archify SVG ───────────────> normal slide and PDF
  └─ ArchifyExplorer button ─> dialog ─> standalone Archify HTML viewer
```

The Vue component only opens and closes a native dialog. The interactive diagram remains the standalone HTML produced by Archify, hosted under Slidev's `public/` directory and loaded in a titled iframe. In print mode, Slidev omits the dialog and button; the static SVG remains in the slide.

This split keeps the slide lightweight, avoids embedding a second SVG renderer into Vue, and preserves a predictable PDF export.
