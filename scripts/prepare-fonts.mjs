import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = { en: { stylesheet: '', preload: [] } };

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

// Preserve Fontsource's Unicode subsets: Japanese should never preload the entire font.
for (const [locale, family] of [
  ['ar', 'noto-sans-arabic'],
  ['ja', 'noto-sans-jp'],
]) {
  const source = resolve(root, 'node_modules/@fontsource-variable', family);
  const css = readFileSync(resolve(source, 'index.css'), 'utf8');
  // Preload the core script only; other Unicode subsets load when text needs them.
  const characters = new Set(
    [...(locale === 'ar' ? 'عضلات' : 'の')].map((char) => char.codePointAt(0)),
  );
  const preload = [];
  const output = css.replace(/@font-face\s*\{[^}]+\}/g, (face) => {
    const file = face.match(/url\(\.\/files\/([^)]+)\)/)[1];
    const bytes = readFileSync(resolve(source, 'files', file));
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    const url = `/fonts/${hash}-${file}`;
    write(resolve(root, `public${url}`), bytes);
    const ranges = face
      .match(/unicode-range:\s*([^;]+);/)[1]
      .split(',')
      .map((range) => {
        const [start, end] = range.trim().replace(/^U\+/i, '').split('-');
        return [parseInt(start, 16), parseInt(end || start, 16)];
      });
    if (
      [...characters].some((code) => ranges.some(([start, end]) => code >= start && code <= end))
    ) {
      preload.push(url);
    }
    // Give the preloaded face time to render instead of abandoning it after optional's window.
    return face
      .replace(`./files/${file}`, url)
      .replace('font-display: swap', 'font-display: block');
  });
  const hash = createHash('sha256').update(output).digest('hex').slice(0, 12);
  const stylesheet = `/fonts/${family}-${hash}.css`;
  write(resolve(root, `public${stylesheet}`), output);
  write(
    resolve(root, `public/fonts/${family}-LICENSE.txt`),
    readFileSync(resolve(source, 'LICENSE')),
  );
  manifest[locale] = { stylesheet, preload };
}

write(resolve(root, 'src/generated/fonts.json'), JSON.stringify(manifest, null, 2) + '\n');
