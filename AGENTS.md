# Repository guidance

## Language

- Write repository documentation, issue and pull request content, commit messages, and code comments in English.
- Keep examples, demo UI, and presentation content in another language only when that language is an explicit product/demo requirement.

## Commits and releases

- Use Conventional Commits for every commit and pull request title. The pull request title becomes the squash commit message on `main`, so it determines the Semantic Release outcome.
- Use one of the repository-validated types: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `perf`, `test`, `build`, or `revert`. Keep the header under 100 characters.
- Examples: `feat: add keyboard navigation`, `fix(explorer): restore focus after closing dialog`, `docs: explain npm installation`.
- Semantic Release maps `feat` to a minor release; `fix` and `perf` to a patch release; and `!` or a `BREAKING CHANGE:` footer to a major release. Other types do not release by default unless they carry a breaking-change marker.
- Never add a release tag or run `npm publish` manually for routine releases. Merging to `main` triggers the configured Semantic Release workflow; publishing is gated by `NPM_PUBLISH_ENABLED` and npm Trusted Publishing.

## Pull requests

- Keep each PR focused, link the relevant issue, and use a Conventional Commit title.
- Explain the motivation and change, list verification performed, and state the expected release impact in the PR template.
- Run `npm ci` and `npm run build` for component or demo changes. Run `npm run export` when print/PDF behavior changes.
- Preserve the existing ruleset, required checks, and least-privilege workflow permissions. Do not bypass repository protections unless explicitly authorized by the repository owner.

## Issues and security

- Use the existing English issue forms under `.github/ISSUE_TEMPLATE` for bug reports and feature requests.
- Do not put credentials, tokens, or sensitive vulnerability details in public issues. Use the private security reporting link in the issue-form configuration.
- Do not add a long-lived npm publish token; use the configured npm Trusted Publisher/OIDC workflow.