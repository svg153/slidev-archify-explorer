# Repository policy

Repository metadata and branch policy are reproducible with:

```powershell
./scripts/configure-github.ps1
```

The script sets the description and topics, creates/updates the `type:*`, `area:*`, and `priority:*` labels, enables squash-only merging, and applies the `main-pull-request` ruleset.

## Main branch

- Changes normally enter `main` through a pull request.
- The PR must have one approval, resolved review threads, and passing `test`, `title`, and `commits` checks.
- Only `svg153` is an explicit bypass actor. The owner can bypass all rules when needed; contributors cannot.
- Deletion, force pushes, and non-linear history are blocked; merges use squash.
- Conventional Commit PR titles and commit messages are checked in CI; local commits are checked with commitlint through Husky.

GitHub-hosted settings remain authoritative; this document and the setup script describe the intended policy.
