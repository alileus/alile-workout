# Architecture

Routes compose features. Features own types, data adapters, models and components. Shared UI has no workout-specific dependencies. Avoid business rules in app routes or duplicate primitives inside features.

Atlas routes own the selected training group and muscle; React owns temporary hover, search, and view state. Hover previews anatomy; selection navigates to a shareable route, with selecting the current muscle returning to its group. Stable IDs connect JSON content to a separate geometry catalog. Groups represent training-day choices, not anatomical taxonomy.

The body-model provider starts with the male schematic and keeps the chosen male/female model while navigating within a locale. Fresh loads default to male. Female artwork is derived by the shared proportion transform in `body-variants.ts`; outline, visible muscles, clickable paths, selected overlays, and hand/foot zoom bounds all use that same geometry. The proportions are illustrative, not anatomical measurements. Both models share muscle IDs, guide content, and canonical routes; the model choice does not imply different exercise prescriptions.

The workout book is validated with Zod. English is the source catalog, with complete per-entry locale overlays. The server-rendered atlas and MovementGuide use the same loader. `/[locale]/muscles/[group]` and `/[locale]/muscles/[group]/[region]` have persistent URLs, canonical metadata, hreflang, and CollectionPage or Article structured data. Old book routes permanently redirect to the matching atlas route. Route resolution rejects muscles under the wrong group.

next-intl manages prefixed routes and interface strings. The locale root sets HTML lang/dir. English fallback uses lang=en and dir=ltr inside RTL pages. Use logical CSS properties. Never mirror anatomy itself.

Metadata images use language-neutral SVG anatomy rendered to PNG by Next ImageResponse. The region or group query parameter changes the highlight and front/back view. No Arabic shaping or external font download is needed.

GitHub Issue Forms provide no-code intake. Maintainers review evidence and create versioned JSON PRs. Issues never auto-publish.
