# Design system

Visit /en/design-system, /ar/design-system or /ja/design-system for the gallery.

Semantic tokens live in src/app/globals.css, mapped to Tailwind via @theme inline. Use bg-background, text-muted-foreground, border-border and text-primary rather than new palettes. Surfaces/anatomy are grayscale. Teal indicates hover, focus and selection.

Shared primitives live in src/components/ui and are shadcn/ui source components. components.json enables the new-york style, CSS variables and RTL. Add components using `npx shadcn@latest add <component>`; inspect generated code before committing.

Desktop uses 36% anatomy / 29% regions / 35% guide. The selector spans the latter columns while anatomy spans the full height. Mobile uses fixed grid rows for anatomy, selector and independently scrolling content. Selecting a region replaces the bottom pane with the guide.

Use native buttons with accessible names and aria-pressed for toggles. SVG focus uses contrasting fill/stroke; keyboard controls elsewhere retain focus indicators. Respect reduced motion. Rotate directional icons in RTL, never anatomy.

Navigation lives in a shared shadcn bottom drawer on desktop and mobile, opened by a floating Lucide Menu icon button. Route links use Button styling; disclosure indicators switch from plus to minus when expanded. Global links and language selection belong in the drawer, not a footer. Back arrows follow text direction. The atlas is centered at a maximum width of 1600px, and the drawer trigger stays inside that boundary. The drawer is centered with a 400px maximum width and fills smaller screens. Route buttons stack vertically; language selection is centered with GitHub underneath. Content panels and drawer content keep vertical scrollbar space reserved to prevent layout shifts.

The atlas is the single browsing entry point, with a translated introduction when no muscle is selected. Groups use `/[locale]/muscles/[group]`; individual regions use `/[locale]/muscles/[group]/[region]`. Selection, browser history, refreshes and language changes preserve these shareable URLs. Each route has localized metadata, canonical and language alternatives, structured data, and an anatomy preview highlighting its group or region. The old `/[locale]/book` index redirects home, and old book entry links permanently redirect to the matching muscle route. The atlas exposes Suggest an edit for the current group, and each muscle guide has its own contextual edit link.

The region heading and edit action share one compact row above search. Anatomy uses shared shadcn/Radix tooltips, with translated labels and no native title popups. Keyboard focus highlights the muscle shape instead of drawing a rectangular SVG outline.

The floating menu trigger is centered at the bottom of the viewport. The muscle selector fills its grid area, stays visible while the content scrolls, and uses horizontal scroll snapping with faded edges. Selected groups scroll into view in either text direction. The drawer moves focus inside on open and restores it to the trigger on close.

Arabic and Japanese fonts are self-hosted from Fontsource. `npm run fonts` generates hashed assets and locale-specific preload manifests; it runs automatically on install, dev, build and typecheck. Only the core script subset is preloaded; other Unicode subsets load when needed. `font-display: block` lets the preloaded face finish before text paints, with the browser's bounded fallback window on slow connections. English uses the system Arial stack.

The gallery is localized in English, Arabic, and Japanese, including metadata, and is excluded from indexing. Technical CSS identifiers remain unchanged alongside translated labels. Page strings belong in all three message catalogs. Only links opening a new tab display the external-link arrow. All scrollbars share a slim rounded primary-color thumb; modal scroll locking must not add a second gutter margin.
