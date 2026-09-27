# alile-workout

An open muscle atlas and workout book. Choose a training-day group, explore individual regions, and see movements with the other muscles they involve.

Next.js App Router · TypeScript · Tailwind CSS 4 · shadcn/ui · next-intl

## Run locally

Use Node.js 24 LTS and npm. No database, account or secrets are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Routes: `/en`, `/ar` (RTL), `/ja`.

```sh
npm run check   # formatting, lint, types, content checks, production build
npm run format
```

## Contribute without coding

Choose **Suggest an edit** in any muscle guide, or use the [workout book form](https://github.com/alileus/alile-workout/issues/new?template=book-update.yml). Submit corrections, exercise suggestions, references or translations in English, Arabic or Japanese. A free GitHub account is required. Maintainers review suggestions and convert accepted changes into PRs; submissions do not publish automatically.

## Project map

| Location                    | Responsibility                                           |
| --------------------------- | -------------------------------------------------------- |
| `src/app`                   | Routes, server-rendered pages, SEO and dynamic images    |
| `src/features/anatomy`      | Interactive anatomy and schematic geometry               |
| `src/features/workout-book` | Schema, content loader, movement guide                   |
| `src/components/ui`         | Reusable shadcn/ui primitives                            |
| `src/app/globals.css`       | Semantic tokens and responsive layout                    |
| `src/i18n`, `messages`      | Locale routing and translated interface                  |
| `content/book`              | Versioned workout content and translations               |
| `tests`                     | Content, geometry, locale, metadata and selection checks |

See [architecture](docs/architecture.md), [design system](docs/design-system.md), [content guide](docs/content-guide.md), and [contributing](CONTRIBUTING.md). The component gallery is available at `/en/design-system` and in the other locales.

## Content status

The imported prototype has **100 schematic regions** across Chest, Back, Shoulders, Arms, Core and Legs. It is a community draft awaiting expert review, not a claim of exhaustive anatomical coverage. Small muscles and deep layers are shown schematically. References and review status belong to each entry.

The interface, contribution flows, and all 100 muscle guides are available in English, Arabic, and Japanese. Translations include names, descriptions, exercises, instructions, cues, equipment, volume, and other muscles involved. Tests require complete coverage and reject unchanged English text in translated fields. Content remains a community draft open to fluent-speaker and expert review.

## Branches and future hosting

| Branch       | Vercel environment | Domain              |
| ------------ | ------------------ | ------------------- |
| `main`       | Preview            | `workout.alile.dev` |
| `production` | Production         | `workout.alile.us`  |

**Vercel is not connected by this setup.** Set Vercel's Production Branch to `production` before deploying, and assign the testing domain to `main`. Once connected, pushes trigger deployments. See [deployment setup](docs/deployment.md).

Only builds with `VERCEL_ENV=production` permit indexing. Preview/local builds use noindex metadata, a noindex response header, a blocking robots file and an empty sitemap. Canonicals always use the live domain. Dynamic PNG share images use language-neutral anatomy highlights.

## License

[MIT](LICENSE). Contributions use the same license. Linked third-party references retain their own licenses.
