# npm publishing

The package name `slidev-addon-archify-explorer` returned 404 from the npm registry on 2026-09-28. That only means it was not published at the time; it does not reserve the name.

The release workflow continues to create GitHub releases, but npm publishing is deliberately disabled unless the repository variable `NPM_PUBLISH_ENABLED` is exactly `true`. Do not enable it until the package owner approves the public bootstrap and the Trusted Publisher is configured.

## One-time bootstrap

1. Recheck the name, inspect `npm pack --dry-run`, and review the exact source/version to publish. In a disposable clean checkout, set the package version to the latest GitHub release tag (without its leading `v`) with `npm version <version> --no-git-tag-version`, then inspect the tarball again.
2. With the package owner's npm account and 2FA, run `npm publish` manually from that reviewed source/version. This is the only token-based step; it is intentionally not automated because npm Trusted Publishing can only be configured for an existing package.
3. In npm package settings, add a GitHub Actions Trusted Publisher with owner `svg153`, repository `slidev-archify-explorer`, and workflow filename `release.yml`. Allow the `npm publish` action (Semantic Release invokes direct publish, not staged publish). The repository must remain public for npm provenance.
4. Verify the package and publisher configuration, then set the repository Actions variable `NPM_PUBLISH_ENABLED` to `true`. Subsequent semantic-release runs publish to npm and GitHub from the same Conventional Commit-derived version.
5. Change the README install command to `npm install --save-dev slidev-addon-archify-explorer` after the package is confirmed live.

The release workflow uses Node 24 and updates its npm CLI to `^11.5.1` when publishing is enabled. npm Trusted Publishing requires Node 22.14+ and npm 11.5.1+, plus GitHub Actions `id-token: write`; npm generates provenance automatically for public packages published from this public GitHub repository. Do not add a long-lived npm write token.

## Verify the package locally

```sh
npm ci
npm run build
npm run test:component
npm pack --dry-run
```

The package `files` allowlist includes only the component and the README demo screenshot (npm also includes its package metadata, README, and license files). The demo deck, diagrams, workflow files, and tests are not shipped.
