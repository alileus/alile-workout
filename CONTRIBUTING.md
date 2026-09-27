# Contributing

Content, translation, design, accessibility, and code contributions are welcome.

## Without code

Use the [workout book form](https://github.com/alileus/alile-workout/issues/new?template=book-update.yml). Include the entry, proposed replacement, and a reference for factual changes. Arabic and Japanese submissions are welcome. Maintainers discuss suggestions and open PRs for accepted changes, crediting the contributor and linking the issue.

## Pull requests

1. Fork and create a branch from `main`.
2. Run `npm ci` using Node 24 LTS.
3. Make a focused change. Keep domain behavior in its feature and shared primitives in `components/ui`.
4. Run `npm run format` and `npm run check`.
5. Check UI changes on desktop/mobile, with keyboard, and in all locales including RTL.
6. Open a PR into `main` with validation notes.

Follow the [content guide](docs/content-guide.md) for workout edits. Keep `reviewStatus: "draft"` until a qualified reviewer has reviewed claims in the PR. Do not infer isolated targeting from general movement.

Translations use complete entries in `content/book/ar/regions.json` or `content/book/ja/regions.json`, keyed by English IDs. Keep IDs, reference URLs and exercise count unchanged. Missing entries are explicitly shown in English.

Maintainers promote tested changes from `main` to `production` through a PR. Do not target production with ordinary feature PRs or force-push shared branches.
