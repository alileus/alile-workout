// Optional artwork QA. Rasterize every mirrored highlight against the actual vector alpha.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const directory = path.dirname(fileURLToPath(import.meta.url));
const geometry = JSON.parse(
  fs.readFileSync(path.join(directory, '../src/features/anatomy/data/geometry.json'), 'utf8'),
);
const output = process.argv[2];
const alignment = JSON.parse(
  fs.readFileSync(path.join(directory, '../src/features/anatomy/data/alignment.json'), 'utf8'),
);
function aligned(svg, view) {
  const { x, y, scaleY } = alignment[view];
  return svg
    .replace(/(<svg\b[^>]*>)/, `$1<g transform="translate(${x} ${y}) scale(1 ${scaleY})">`)
    .replace('</svg>', '</g></svg>');
}
const scale = 3;
async function raster(svg) {
  return sharp(Buffer.from(svg))
    .resize(400 * scale, 670 * scale)
    .ensureAlpha()
    .raw()
    .toBuffer();
}
async function main() {
  const artwork = {};
  for (const view of ['front', 'back']) {
    const svg = fs.readFileSync(path.join(directory, '../public', geometry.artwork[view]), 'utf8');
    artwork[view] = { svg, pixels: await raster(aligned(svg, view)) };
  }
  const frames = Object.fromEntries(
    Object.entries(artwork).map(([view, { pixels }]) => {
      let top = Infinity,
        bottom = 0,
        headLeft = Infinity,
        headRight = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) continue;
        const pixel = (i - 3) / 4;
        const x = pixel % (400 * scale),
          y = Math.floor(pixel / (400 * scale));
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        if (y < 70 * scale) {
          headLeft = Math.min(headLeft, x);
          headRight = Math.max(headRight, x);
        }
      }
      return [
        view,
        {
          top: top / scale,
          bottom: bottom / scale,
          headCenter: (headLeft + headRight) / (2 * scale),
        },
      ];
    }),
  );
  for (const anchor of ['top', 'bottom', 'headCenter']) {
    assert.ok(
      Math.abs(frames.front[anchor] - frames.back[anchor]) <= 1,
      `Front/back ${anchor} alignment drifted`,
    );
  }
  const results = [];
  if (output) fs.mkdirSync(output, { recursive: true });
  for (const [id, region] of Object.entries(geometry.regions)) {
    const paths = region.d.map((d) => `<path d="${d}"/>`).join('');
    const overlay = `${paths}<g transform="translate(400 0) scale(-1 1)">${paths}</g>`;
    const pixels = await raster(
      aligned(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 670"><g fill="white" stroke="white" stroke-width="0.9">${overlay}</g></svg>`,
        region.view,
      ),
    );
    let total = 0,
      outside = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) continue;
      total++;
      if (artwork[region.view].pixels[i] < 128) outside++;
    }
    results.push({
      id,
      view: region.view,
      deep: !!region.deep,
      outside,
      total,
      percent: +((100 * outside) / total).toFixed(2),
    });
    if (output) {
      const composite = artwork[region.view].svg.replace(
        '</svg>',
        `<g fill="#ffbc58" fill-opacity=".65" stroke="#fff" stroke-width=".4">${overlay}</g></svg>`,
      );
      await sharp(Buffer.from(aligned(composite, region.view)))
        .resize(400, 670)
        .flatten({ background: '#161513' })
        .png()
        .toFile(path.join(output, `${id}.png`));
    }
  }
  results.sort((a, b) => b.percent - a.percent);
  if (output) fs.writeFileSync(path.join(output, 'audit.json'), JSON.stringify(results, null, 2));
  console.log(
    JSON.stringify(
      results.filter((r) => r.outside),
      null,
      2,
    ),
  );
  console.log(
    `Checked ${results.length} regions, both sides of each body; ${results.filter((r) => r.outside).length} have pixels outside the artwork.`,
  );
  if (results.some((r) => r.outside || !r.total)) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
