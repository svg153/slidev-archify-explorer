# Slidev Archify Explorer

**Open an Archify diagram as a full interactive view from a Slidev slide.** Keep the slide clean and readable; let the audience explore the diagram when they want more detail. The static SVG remains in the deck for PDF export.

[![CI](https://github.com/svg153/slidev-archify-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/svg153/slidev-archify-explorer/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/svg153/slidev-archify-explorer?display_name=tag)](https://github.com/svg153/slidev-archify-explorer/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Slidev demo with an Archify diagram and the open interactive explorer](media/archify-explorer-demo.png)

## What it does

`ArchifyExplorer.vue` adds an **Explore diagram** button. It opens a native dialog containing Archify's standalone HTML viewer, so viewers can focus nodes, follow relationships, search, and use the Archify controls without leaving the presentation.

- Works with Archify standalone HTML files; the HTML carries its viewer with it.
- Respects Slidev's configured base path.
- Uses native `<dialog>` and an accessible, titled iframe.
- Hides the button and dialog in Slidev PDF/print mode; keep a static SVG on the slide as the export-safe view.
- Button and close labels can be localized.

## Try the demo

```sh
npm ci
npm run dev
```

Slidev opens the one-slide example at `http://localhost:3030`. Click **Explore diagram**, then select a node in the Archify view.

The demo pairs `public/diagrams/ai-sdlc-control-plane.svg` (static slide/PDF image) with `public/diagrams/ai-sdlc-control-plane.html` (interactive viewer). Its editable Archify source is in `diagrams/`.

## Use it in your deck

1. Copy `components/ArchifyExplorer.vue` into your Slidev project's `components/` directory.
2. Put the standalone Archify HTML and its corresponding SVG under `public/`.
3. Embed the static SVG, then add the component:

```md
<img src="/diagrams/system.svg" alt="System architecture" />

<ArchifyExplorer
  src="diagrams/system.html"
  title="System architecture"
  button-label="Explore diagram"
  close-label="Close"
/>
```

`src` is a path under `public/`, not a remote URL. Slidev's base URL is prepended automatically. The default labels are English; pass `button-label` and `close-label` to localize them. The SVG is your static fallback—this component only provides the interactive view.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the demo presentation |
| `npm run build` | Build the static Slidev deck |
| `npm run export` | Export the deck to PDF |

Requires Node.js 22.

## Contributing

Issues and pull requests are welcome. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles, for example `feat: support custom button labels`. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Releases and version tags are generated from Conventional Commits with [semantic-release](https://github.com/semantic-release/semantic-release). Releases are published on GitHub; this repository is not currently an npm package.

## License

The component and demo source are MIT-licensed; see [LICENSE](LICENSE). The included standalone diagram embeds Archify and third-party viewer code. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [ARCHIFY-LICENSE](ARCHIFY-LICENSE).
