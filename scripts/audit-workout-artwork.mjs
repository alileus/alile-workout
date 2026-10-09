// Optional visual QA: render selected vectors into labeled contact sheets.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const output = process.argv[2];
if (!output) throw new Error('Provide an output directory for the artwork audit.');
fs.mkdirSync(output, { recursive: true });
const ids = JSON.parse(fs.readFileSync('src/features/workout-book/artwork.json', 'utf8'));
const width = 420,
  height = 308,
  columns = 4,
  perPage = 16;
const report = [];
let cells = [];
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
async function sheet(index) {
  const rows = Math.ceil(cells.length / columns);
  await sharp({
    create: { width: width * columns, height: height * rows, channels: 4, background: '#161513' },
  })
    .composite(
      cells.map((input, offset) => ({
        input,
        left: (offset % columns) * width,
        top: Math.floor(offset / columns) * height,
      })),
    )
    .png()
    .toFile(path.join(output, `workouts-${index}.png`));
  cells = [];
}
for (const [index, id] of ids.entries()) {
  const svg = fs.readFileSync(`public/workouts/${id}.svg`);
  const drawing = await sharp(svg).resize(396, 264).png().toBuffer();
  const label = Buffer.from(
    `<svg width="420" height="32"><text x="12" y="23" fill="#d3bd94" font-family="sans-serif" font-size="13">${escape(id)}</text></svg>`,
  );
  cells.push(
    await sharp({ create: { width, height, channels: 4, background: '#161513' } })
      .composite([
        { input: drawing, left: 12, top: 12 },
        { input: label, left: 0, top: 276 },
      ])
      .png()
      .toBuffer(),
  );
  const { data, info } = await sharp(drawing)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const halves = [0, 0];
  for (let pixel = 0; pixel < info.width * info.height; pixel++)
    if (data[pixel * 4 + 3] > 128) halves[pixel % info.width < info.width / 2 ? 0 : 1]++;
  if (halves.some((count) => count < 100)) throw new Error(`Missing study in ${id}`);
  report.push({ id, bytes: svg.length, visiblePixels: halves });
  if (cells.length === perPage || index === ids.length - 1)
    await sheet(Math.floor(index / perPage) + 1);
}
fs.writeFileSync(path.join(output, 'workout-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`${ids.length} two-pose vectors rendered and checked in ${output}`);
