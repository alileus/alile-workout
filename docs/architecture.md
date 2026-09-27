# Architecture

Routes compose features. Features own types, data adapters, models and components. Shared UI has no workout-specific dependencies. Avoid business rules in app routes or duplicate primitives inside features.

The React atlas owns group, pinned-region, hovered-region and view state. Hover temporarily previews anatomy; click toggles the pinned guide. Stable IDs connect JSON content to a separate geometry catalog. Groups represent training-day choices, not anatomical taxonomy.

The workout book is validated with Zod. English is the source catalog, with complete per-entry locale overlays. Atlas and server-rendered book pages share the loader and MovementGuide renderer. Book pages have persistent URLs, canonical metadata, hreflang and Article structured data.

next-intl manages prefixed routes and interface strings. The locale root sets HTML lang/dir. English fallback uses lang=en and dir=ltr inside RTL pages. Use logical CSS properties. Never mirror anatomy itself.

Metadata images use language-neutral SVG anatomy rendered to PNG by Next ImageResponse. The region query parameter changes the highlight. No Arabic shaping or external font download is needed.

GitHub Issue Forms provide no-code intake. Maintainers review evidence and create versioned JSON PRs. Issues never auto-publish.
