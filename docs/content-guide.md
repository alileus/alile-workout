# Workout content

English group files contain sections and regions. IDs are permanent URL slugs and geometry keys; changing one breaks links.

Every region has a name, description, note, references, review status and exercises. Each exercise has a name, equipment, example volume, instructions, cue and alsoWorks. These are educational examples, not individualized programs. Describe shared loading precisely and avoid claiming that general movements isolate deep muscles.

Use sources supporting the specific claim. Inherited prototype references include broad background pages and do not establish expert review. Migrated entries start as draft. To mark reviewed, document a qualified reviewer and claim-specific sources in the PR. Geometry is schematic.

## No-code review workflow

Submit the Book Update form. A maintainer checks sources, edits JSON, runs checks, previews the result, credits the issue author and opens a PR into main. Issues cannot automatically change content.

## Translations

Copy the entire English region object to content/book/ar/regions.json or content/book/ja/regions.json, keyed by ID. Preserve IDs, references and exercise count. Translate all visible fields and request fluent-speaker review. Tests report coverage.

Missing translations are explicitly labeled English and given appropriate language/direction attributes. Interface strings live in messages and must have matching keys.

## New regions

Add to an existing workout-day group and section, add geometry under the stable ID, include HTTPS sources and complete movement choices, run npm run check, and verify hover/toggle on mobile and desktop. Request content and anatomy review in the PR.
