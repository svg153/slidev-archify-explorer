# npm publishing

`slidev-addon-archify-explorer@1.2.0` is published on npm. That version was published manually; the repository's automated Semantic Release → npm Trusted Publishing/OIDC path has not yet been verified end to end.

The release workflow always creates GitHub releases. npm publishing is enabled when the repository variable `NPM_PUBLISH_ENABLED` is exactly `true`. Before relying on the next automated npm publish, confirm the npm-side Trusted Publisher settings below. Do not add a long-lived npm write token or create a dummy version to test publishing.

## Trusted Publisher configuration

In the npm package settings for `slidev-addon-archify-explorer`, confirm a GitHub Actions Trusted Publisher with:

- Owner: `svg153`
- Repository: `slidev-archify-explorer`
- Workflow filename: `release.yml` (filename only, not the `.github/workflows/` path)
- Allowed publishing action: direct `npm publish` (Semantic Release does not use staged publishing)

Keep the repository and package public for npm provenance. The release workflow uses a GitHub-hosted runner, Node 24, npm `^11.5.1`, and `id-token: write`. npm Trusted Publishing requires Node 22.14+ and npm 11.5.1+; with a qualifying public GitHub Actions publish, npm generates provenance automatically. The npm-side publisher settings cannot be confirmed through the public registry, so verify them in npm's UI. Once confirmed, leave `NPM_PUBLISH_ENABLED=true` for subsequent legitimate releases.

## Verify a real OIDC release

After the next normal Semantic Release (do not publish a test version), check the package version's provenance field:

```sh
npm view slidev-addon-archify-explorer@<version> dist.attestations --json
```

Confirm the attestation identifies this public repository and the expected GitHub Actions release workflow/commit. A registry signature by itself is not proof of an OIDC Trusted Publisher release. If the publish fails, stop and inspect the npm/GitHub workflow error before changing publisher settings; do not fall back to a token-based CI publish.

## Verify the package locally

```sh
npm ci
npm run build
npm run test:component
npm pack --dry-run
```

The package `files` allowlist includes only the component and the README demo screenshot (npm also includes its package metadata, README, and license files). The demo deck, diagrams, workflow files, and tests are not shipped.
