# Anatomy artwork

The approved reference is `anatomy-reference.png`, generated with the built-in GPT Image tool. The app uses **real vector paths**, not that raster embedded in an SVG. `public/anatomy/front.svg` and `back.svg` preserve the original pencil shading and linework. They are separate cached assets, keeping thousands of tracing paths out of the React DOM.

## Rebuilding the trace

Optional art tooling, independent of the app's Node dependencies:

```sh
python -m pip install pillow numpy opencv-python vtracer
python scripts/trace-anatomy.py
```

The script extracts each silhouette, quantizes small tonal differences, and traces curved SVG paths. Both views use `0 0 400 670` coordinates. A neutral surface replaces an ambiguous generated pelvic detail; no genital anatomy is represented. The original reference is preserved for provenance.

## Editing interactive regions

`alignment.json` registers the front and back at the same head center and crown-to-sole height. Apply its transform to the artwork and interactive paths together; detail view boxes and social images use the same registration. The artwork audit checks these alignment anchors within one SVG unit as well as muscle containment.

`src/features/anatomy/data/geometry.json` contains all 100 stable muscle IDs and their overlay paths. The 43 superficial regions were traced against the new artwork; deep layers are illustrative cutaways adapted to its proportions. The renderer mirrors left-side paths around x=200. Front and back have their own geometry, and hand/foot detail bounds match the new illustrations. Change the visible region, hit target and selection shape together by editing `d`; do not add a separate invisible approximation. Use translucent gold highlights to preserve pencil detail beneath them.

This is a schematic educational atlas, not clinically validated anatomy. Content and deep-layer illustrations remain open to expert corrections through the existing contribution workflow.

All overlays are fitted inside both sides of their actual vector silhouette, including clearance for the 0.9-unit highlight stroke. `npm test` checks all 100 regions against the rendered artwork alpha, rather than only the SVG canvas bounds. Run `node scripts/audit-anatomy.mjs <output-directory>` to also export a labeled JSON report and individual overlay previews. Re-run this audit after changing either the artwork or region geometry; the illustrated body is subtly asymmetric even though highlights are mirrored.

## Approved generation prompt

Use case: scientific-educational. Create a polished visual concept for an interactive muscle anatomy atlas, to be reviewed before tracing into editable SVG. Show the same adult male body in two complete orthographic views, front on the left and back on the right, side by side, equal scale and aligned. Entire figures from crown to soles within frame, generous margin. Neutral anatomical standing pose, arms slightly away from torso, hands relaxed with natural distinct fingers, palms forward in front view; back of hands in rear view. Lean athletic natural build, moderate shoulder width, balanced waist and legs, not an exaggerated bodybuilder. Smooth believable head silhouette with subtle eyebrows and nose on front only; no mouth, no hair; back of head plain. No genital details. Carefully drawn natural hands and feet. Professional simplified anatomical illustration, elegant clean vector-like contours and smoothly curved muscle shapes, restrained detail, clear major muscle regions. Accurate coherent anatomy rather than hard armored plates or a robot. Muscles should read as a continuous human body, separated with fine subtle lines rather than large gaps. Monochrome charcoal-gray silhouette with medium-gray muscle regions on a flat very dark background; restrained fills suitable for tracing, no dramatic highlights or 3D lighting. No UI, labels, text, arrows, branding, decorative circles, or watermark.
