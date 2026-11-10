# Contributing

The repository is released under the MIT license, and follows a standard Github development process, using Github tracker for issues and merging pull requests into main.

## Development

```shell
npm install            # Node ^22.18.0 || >=24.11.0
npm run dev            # Vite dev server with the root index.html
npm run lint           # ESLint (flat config, @antfu/eslint-config)
npm run lint:style     # Stylelint for the inline styles of the demo pages
npm test               # Jest
npm run package        # build dist/ and assemble .release/
```

`index.html` in the repository root is the Vite dev entry and imports `src/` directly. The pages in `static/` are the GitHub Pages demo: they load the bundled `swiper-animation.umd.js` through a `<script>` tag and are deployed by `npm run build:deployment`, which assembles `.publish`.

The package is ESM only. `vite.config.mjs` builds `dist/swiper-animation.esm.js`, `dist/swiper-animation.umd.js` and `dist/swiper-animation.umd.min.js`; there is no CommonJS output.

## Repository settings required by the bots

`.github/workflows/dependabotAutoMerge.yml` merges non-major Dependabot pull requests automatically. Three settings cannot be expressed in code and must be enabled by a maintainer:

1. **Settings → Actions → General → Workflow permissions**: choose *Read and write permissions*. Dependabot opens its pull requests from branches inside this repository, which is why the `pull_request` event can hand `GITHUB_TOKEN` a write token there. Pull requests from forks stay read-only, and the workflow skips them through the `head.repo.full_name` guard.
2. **Settings → General**: enable *Allow auto-merge*.
3. **Branch protection on `main`**: block force pushes and deletions, but leave *Require status checks to pass before merging* **off**. `semantic-release` pushes `chore(release): … [skip ci]` straight to `main`, and GitHub rejects that push while a required check is configured. A repository owned by a personal account cannot add the GitHub Actions app to a ruleset bypass list either, so there is no way to have both.

The CI gate for Dependabot lives in `dependabotAutoMerge.yml` instead: it polls the aggregated `Test CI Summary` check before asking for a squash merge. `Test CI` reports one check per matrix cell (`test (22, ubuntu-latest)` and so on), so the `test-status` job aggregates them into a single check that is easy to read and to require.

`Test CI` keeps the write token away from the steps that execute repository code: the `test` job is read-only, and the semantic-release dry-run lives in its own `release-dry-run` job gated to trusted refs.

npm publishing uses [trusted publishing](https://docs.npmjs.com/trusted-publishers) over OIDC, so the `Release` workflow needs no `NPM_TOKEN`. The package has to be configured once on npmjs.com (Settings → Trusted Publisher → GitHub Actions: `cycjimmy` / `swiper-animation` / `release.yml`). To fall back to a token, add `NPM_TOKEN` to the `Semantic Release` step environment.

## Labels

The triage bot and the issue forms reference labels that have to exist in the repository. `issues.addLabels` fails with `422` for unknown labels, so keep this list in sync when a rule changes:

| Label | Used by |
| --- | --- |
| `bug` | `bug_report.yml` form |
| `enhancement` | `feature_request.yml` form |
| `needs-info` | triage rule 3, plus the 7-day lifecycle in `stale.yml` |
| `usage` | triage rule 1 (questions about using the package) |
| `browser-support` | triage rule 2 (legacy browsers, IE, polyfills) |
| `triaged` | manual exemption from the half-year staleness in `stale.yml` |
| `stale` | applied and removed by `actions/stale` |
| `ci` | `dependabot.yml` github-actions group |
| `dependencies` | `dependabot.yml` both ecosystems |

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) are required: `semantic-release` derives the version and the changelog from them. A breaking change must be marked with `!` and a `BREAKING CHANGE:` footer. Commit subjects and bodies are written in English, and so are pull request titles, pull request bodies and issue comments.
