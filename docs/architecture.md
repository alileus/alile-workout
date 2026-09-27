# Architecture

Routes compose features. Features own types, data adapters, models and components. Shared UI has no workout-specific dependencies. Avoid business rules in app routes or duplicate primitives inside features.

Atlas routes own the selected training group and muscle; React owns temporary hover, search, and view state. Hover previews anatomy; selection navigates to a shareable route, with selecting the current muscle returning to its group. Stable IDs connect JSON content to a separate geometry catalog. Groups represent training-day choices, not anatomical taxonomy.

The `(atlas)` route-group layout shares one mounted atlas across home, group and region routes. Its client adapter reads the localized pathname, while leaf pages retain metadata, validation and structured data. Keep artwork in this layout: mounting it inside each page would restart SVG decoding and reset the compact preview during navigation. Route changes reset transient search and hover state without replacing the anatomy nodes.

The workout book is validated with Zod. English is the source catalog, with complete per-entry locale overlays. The server-rendered atlas and MovementGuide use the same loader. `/[locale]/muscles/[group]` and `/[locale]/muscles/[group]/[region]` have persistent URLs, canonical metadata, hreflang, and CollectionPage or Article structured data. Old book routes permanently redirect to the matching atlas route. Route resolution rejects muscles under the wrong group.

next-intl manages prefixed routes and interface strings. The locale root sets HTML lang/dir. English fallback uses lang=en and dir=ltr inside RTL pages. Use logical CSS properties. Never mirror anatomy itself.

Metadata images use language-neutral SVG anatomy rendered to PNG by Next ImageResponse. The region or group query parameter changes the highlight and front/back view. No Arabic shaping or external font download is needed.

GitHub Issue Forms provide no-code intake. Maintainers review evidence and create versioned JSON PRs. Issues never auto-publish.

Anatomy rendering separates static pencil artwork (`public/anatomy/*.svg`) from semantic muscle geometry (`src/features/anatomy/data/geometry.json`). The artwork is traced vector linework; interactive paths remain small, accessible React elements with stable IDs. `groupPaths` filters by view, preventing front/back regions from mixing. Deep layers are schematic overlays. The Open Graph endpoint reads the same SVG files at runtime; Next output tracing includes them for deployment.
