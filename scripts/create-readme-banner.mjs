import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const geometry = JSON.parse(
  await readFile(new URL('src/features/anatomy/data/geometry.json', root), 'utf8'),
);
const alignment = JSON.parse(
  await readFile(new URL('src/features/anatomy/data/alignment.json', root), 'utf8'),
);

async function figure(view, x, region) {
  const source = await readFile(new URL(`public/anatomy/${view}.svg`, root), 'utf8');
  const content = source.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const highlight = geometry.regions[region].d
    .map((d) => `<path d="${d}"/><path d="${d}" transform="translate(400 0) scale(-1 1)"/>`)
    .join('');
  const { x: offsetX, y, scaleY } = alignment[view];
  return `<svg x="${x}" y="48" width="330" height="570" viewBox="0 0 400 670">
    <g transform="translate(${offsetX} ${y}) scale(1 ${scaleY})">
      <g opacity=".95">${content}</g>
      <g fill="#d4af72" fill-opacity=".48" stroke="#f0d5a5" stroke-width=".6">${highlight}</g>
    </g>
  </svg>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="680" viewBox="0 0 1600 680">
  <defs>
    <radialGradient id="paper"><stop stop-color="#34312a"/><stop offset="1" stop-color="#161513"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ded6c7" stroke-opacity=".035"/></pattern>
  </defs>
  <rect width="1600" height="680" rx="24" fill="#161513"/>
  <rect x="820" width="780" height="680" fill="url(#paper)"/>
  <rect width="1600" height="680" rx="24" fill="url(#grid)"/>
  <path d="M806 56V624" stroke="#ded6c7" stroke-opacity=".16"/>
  <path d="M80 70H128" stroke="#d4af72" stroke-width="3"/>
  <g font-family="Arial, sans-serif">
    <text x="80" y="121" font-size="23" font-weight="700" fill="#d4af72" letter-spacing="3">ALILE-WORKOUT</text>
    <g fill="#e7e3da" font-size="76" font-weight="700" letter-spacing="-2">
      <text x="76" y="252">A field guide</text>
      <text x="76" y="337">to movement.</text>
    </g>
    <g fill="#aaa497" font-size="25">
      <text x="80" y="405">Explore the anatomy. Understand the exercise.</text>
      <text x="80" y="444">Build the book together.</text>
    </g>
    <path d="M80 501H728" stroke="#ded6c7" stroke-opacity=".16"/>
    <g fill="#e7e3da" font-size="29" font-weight="700">
      <text x="80" y="556">100</text><text x="291" y="556">3</text><text x="499" y="556">Open</text>
    </g>
    <g fill="#aaa497" font-size="17" letter-spacing="1">
      <text x="80" y="587">MUSCLE REGIONS</text><text x="291" y="587">LANGUAGES</text><text x="499" y="587">SOURCE + CONTENT</text>
    </g>
    <g fill="#aaa497" font-size="13" letter-spacing="3" text-anchor="middle">
      <text x="1020" y="643">01 / FRONT</text><text x="1350" y="643">02 / BACK</text>
    </g>
  </g>
  ${await figure('front', 855, 'chest-clavicular-head')}
  ${await figure('back', 1185, 'traps-upper-trapezius')}
  <rect x=".5" y=".5" width="1599" height="679" rx="24" fill="none" stroke="#ded6c7" stroke-opacity=".16"/>
</svg>`;

await mkdir(new URL('docs/assets/', root), { recursive: true });
const destination = fileURLToPath(new URL('docs/assets/readme-banner.png', root));
await sharp(Buffer.from(svg)).png().toFile(destination);
console.log(`Created ${destination}`);
