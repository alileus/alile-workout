# Dependency updates

Dependabot targets `main`. Related React/React DOM/type packages and Next.js/lint configuration updates are grouped so they are tested together. Other minor/patch updates are grouped; unrelated major updates receive individual PRs. GitHub Actions updates form one group.

As of September 27, 2026:

| Dependency          | Decision                   | Why                                                                                                                                    |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| React and React DOM | 19.3.0 together            | The independent React DOM update failed npm peer resolution against React 19.2.8. Both must stay aligned.                              |
| Node declarations   | Latest 24.x                | `.nvmrc`, CI and intended Vercel runtime use Node 24. A passing compile with Node 26 declarations could allow APIs missing at runtime. |
| TypeScript          | Latest 6.0.x               | TypeScript 7 is incompatible with the current typescript-eslint API. 6.0 is supported.                                                 |
| ESLint              | Retain 9.x                 | The React lint plugin used by Next.js fails on ESLint 10 (`getFilename` API removal); its published peer range excludes 10.            |
| GitHub Actions      | checkout and setup-node v7 | Supported on the GitHub-hosted Ubuntu runner; validated by CI.                                                                         |

The Dependabot configuration excludes ESLint 10 and TypeScript 6.1–7.x while keeping compatible releases eligible. Node declaration majors require an intentional runtime upgrade. These are compatibility holds, not permission to ignore security advisories.

When Next.js or its lint plugins add support, remove the relevant hold in the same PR that upgrades the toolchain. Keep linting enabled: do not bypass peer dependencies with `--force` or `--legacy-peer-deps`. Run `npm ci`, `npm run check`, and verify the atlas interactions before merging runtime upgrades. Review security alerts separately even for held versions.

References: [typescript-eslint supported versions](https://typescript-eslint.io/users/dependency-versions/), [eslint-plugin-react package](https://www.npmjs.com/package/eslint-plugin-react), [Dependabot options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).
