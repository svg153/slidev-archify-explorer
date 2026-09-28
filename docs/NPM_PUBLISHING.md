# npm publishing

`slidev-addon-archify-explorer@1.2.0` was published manually. Version `1.2.1` was published by Semantic Release through npm Trusted Publishing/OIDC on 2026-09-28, and both its npm provenance and registry signature were verified.

Semantic Release creates a GitHub release when a commit triggers a new version. npm publishing is enabled when the repository variable `NPM_PUBLISH_ENABLED` is exactly `true`. The Trusted Publisher below has been confirmed by the successful 1.2.1 publish. Do not add a long-lived npm write token or create a dummy version to test publishing.

## Current Trusted Publisher

The npm package is configured with a GitHub Actions Trusted Publisher:

- Owner: `svg153`
- Repository: `slidev-archify-explorer`
- Workflow filename: `release.yml` (filename only, not the `.github/workflows/` path)
- Allowed publishing action: direct `npm publish` (Semantic Release does not use staged publishing)

Keep the repository and package public for npm provenance. The release workflow uses a GitHub-hosted runner, Node 24, npm `^11.5.1`, and `id-token: write`. npm Trusted Publishing requires Node 22.14+ and npm 11.5.1+; npm generated provenance for the verified release. Keep `NPM_PUBLISH_ENABLED=true` for subsequent legitimate releases.

## Verify an OIDC release

For example, verify the real `1.2.1` release's provenance metadata:

```sh
npm view slidev-addon-archify-explorer@1.2.1 dist.attestations --json
```

To verify registry signatures and attestations for a clean consumer install:

```sh
npm install --no-save slidev-addon-archify-explorer@1.2.1
npm audit signatures
```

The verified attestation identifies this public repository, `.github/workflows/release.yml`, and release commit `0add8f5f1b25de84b199fd8a03c2a96d1195686b`. GitHub Actions logs also confirmed a successful npm OIDC token exchange and provenance publication. A registry signature by itself is not proof of an OIDC Trusted Publisher release. If a future publish fails, stop and inspect the npm/GitHub workflow error; do not fall back to a token-based CI publish.

## Verify the package locally

```sh
npm ci
npm run build
npm run test:component
npm pack --dry-run
```

The package `files` allowlist includes only the component and the README demo screenshot (npm also includes its package metadata, README, and license files). The demo deck, diagrams, workflow files, and tests are not shipped.
