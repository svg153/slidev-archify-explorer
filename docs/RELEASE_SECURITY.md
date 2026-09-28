# Release security

This document records the current release trust boundaries for `slidev-addon-archify-explorer`, what is enforced by GitHub/npm settings versus repository code, and the remaining verification steps.

## Current release path

1. Pull requests to `main` pass the CI test/build, Conventional Commit title/commit validation, and CodeQL analysis. The active `main-pull-request` ruleset requires one approval, resolved review threads, linear history, and the required checks. The repository owner has an explicit always-bypass entry.
2. Merging a Conventional Commit to `main` starts `.github/workflows/release.yml`; Semantic Release calculates the next version and creates the Git tag, npm package (when enabled), and GitHub release.
3. The workflow uses actions pinned to full commit SHAs, and repository settings require SHA-pinned actions. Dependabot updates GitHub Actions dependencies.
4. GitHub's automatic workflow token has `contents: write` for tags/releases. `issues: write` and `pull-requests: write` are retained for the GitHub Semantic Release plugin's documented permissions. `id-token: write` is used by npm Trusted Publishing when npm publishing is enabled. The release job disables package-manager caching.
5. npm publication is controlled by `NPM_PUBLISH_ENABLED`. The npm Trusted Publisher configuration is external to this repository and must match this repository and `release.yml`; see [npm publishing](NPM_PUBLISHING.md).
6. GitHub immutable releases are enabled. The active `protect-semver-tag-integrity` ruleset prevents updates and deletions of `v*` tags; the owner is the sole bypass actor for recovery. Tag creation remains allowed to repository writers so the release workflow can create tags.

## Current gaps and decisions

- npm OIDC provenance is not yet verified on a real automated version; tracked by [issue #16](https://github.com/svg153/slidev-archify-explorer/issues/16). Check npm's Trusted Publisher configuration in its UI; registry metadata cannot prove that setup before a real release.
- A private disposable repository successfully published an immutable `v1.2.1` GitHub release using the same pinned workflow and Semantic Release configuration; `gh release verify` succeeded. No assets are uploaded by this repository. Production immutability is now enabled. After publication, release assets are locked; deleting an immutable release permanently consumes its tag name.
- The same sandbox proved release creation works with the update/deletion tag ruleset. Unauthorized tag update and delete requests were rejected. On personal repositories, GitHub does not accept the GitHub Actions integration as a ruleset bypass actor (HTTP 422), so tag creation is not restricted; the active ruleset protects updates/deletions and only the owner can bypass for recovery.
- No separate SBOM is published. The package currently has no demonstrated consumer need for a second artifact; an SBOM would inventory components, not prove they are vulnerability-free.

## Configuration versus code

The controls are mostly native settings, not custom code:

- GitHub repository settings: immutable releases, `main` and `v*` rulesets, SHA-pinned Actions policy, CodeQL, and workflow token permissions.
- npm package settings: Trusted Publisher identity (owner/repository/workflow); this must be confirmed in npm's UI.
- Repository files: Semantic Release config, workflow permissions, action SHA pins, documentation, and verification commands. No custom publishing service or long-lived npm token is needed.

The disposable-repository test is complete. Do not create a dummy release to test npm: verify npm provenance after the next legitimate release instead.

## Verification commands

For a real npm release, verify that npm exposes an attestation for the expected version:

```sh
npm view slidev-addon-archify-explorer@<version> dist.attestations --json
```

For an immutable GitHub release, verify the release attestation with GitHub CLI:

```sh
gh release verify v<version> --repo svg153/slidev-archify-explorer
```

Check that the release tag resolves to the expected source commit and that the release notes/version agree with the npm package. Do not treat an SBOM or a valid provenance statement as proof that the source is vulnerability-free.
