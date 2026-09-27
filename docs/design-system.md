# Design system

Visit /en/design-system, /ar/design-system or /ja/design-system for the gallery.

Semantic tokens live in src/app/globals.css, mapped to Tailwind via @theme inline. Use bg-background, text-muted-foreground, border-border and text-primary rather than new palettes. Surfaces/anatomy are grayscale. Teal indicates hover, focus and selection.

Shared primitives live in src/components/ui and are shadcn/ui source components. components.json enables the new-york style, CSS variables and RTL. Add components using `npx shadcn@latest add <component>`; inspect generated code before committing.

Desktop uses 36% anatomy / 29% regions / 35% guide. The selector spans the latter columns while anatomy spans the full height. Mobile uses fixed grid rows for anatomy, selector and independently scrolling content. Selecting a region replaces the bottom pane with the guide.

Use native buttons with accessible names and aria-pressed for toggles. SVG focus uses contrasting fill/stroke; keyboard controls elsewhere retain focus indicators. Respect reduced motion. Rotate directional icons in RTL, never anatomy.

The gallery is English developer documentation excluded from indexing. Product strings belong in all three message catalogs.
