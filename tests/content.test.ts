import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  englishBook,
  getBook,
  hasTranslation,
  getRegion,
  suggestionUrl,
} from '../src/features/workout-book/data';
import { anatomy, toggleRegion } from '../src/features/anatomy/model';
import { pageMetadata } from '../src/lib/seo';
const regions = englishBook.flatMap((g) => g.sections.flatMap((s) => s.regions));
test('every stable content ID has valid geometry and references', () => {
  assert.equal(new Set(regions.map((r) => r.id)).size, regions.length);
  assert.deepEqual(Object.keys(anatomy.regions).sort(), regions.map((r) => r.id).sort());
  for (const group of englishBook)
    for (const section of group.sections)
      for (const region of section.regions) {
        const geometry = anatomy.regions[region.id];
        assert.equal(geometry.group, group.id);
        assert.ok(['front', 'back'].includes(geometry.view));
        assert.ok(geometry.d.length);
        assert.ok(geometry.d.every((d) => d.startsWith('M')));
        assert.ok(anatomy.paths[geometry.component]);
        assert.equal(anatomy.componentGroup[geometry.component], group.id);
        for (const url of region.references) assert.equal(new URL(url).protocol, 'https:');
      }
});
test('translations preserve identities, references, and exercise counts', () => {
  for (const locale of ['ar', 'ja'] as const) {
    const overlay = JSON.parse(fs.readFileSync(`content/book/${locale}/regions.json`, 'utf8'));
    for (const id of Object.keys(overlay))
      assert.ok(getRegion('en', id), `Unknown translation ${id}`);
    let translated = 0;
    for (const group of getBook(locale))
      for (const section of group.sections)
        for (const region of section.regions) {
          const original = getRegion('en', region.id)!.region;
          assert.equal(region.exercises.length, original.exercises.length);
          assert.deepEqual(region.references, original.references);
          if (hasTranslation(locale, region.id)) translated++;
        }
    console.log(
      `${locale}: ${translated}/${regions.length} book entries translated; remaining entries explicitly fall back to English`,
    );
  }
});
const keys = (value: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, v]) =>
    typeof v === 'object' && v !== null
      ? keys(v as Record<string, unknown>, `${prefix}${key}.`)
      : [prefix + key],
  );
test('all interface locales have matching message keys and section labels', () => {
  const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
  for (const locale of ['en', 'ar', 'ja']) {
    const messages = JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8'));
    assert.deepEqual(keys(messages).sort(), keys(en).sort());
    for (const group of englishBook)
      for (const section of group.sections)
        assert.ok(
          messages.App.sectionNames[section.name],
          `Missing ${locale} section ${section.name}`,
        );
  }
});
test('selection toggles off and switches to another region', () => {
  assert.equal(toggleRegion(null, 'a'), 'a');
  assert.equal(toggleRegion('a', 'a'), null);
  assert.equal(toggleRegion('a', 'b'), 'b');
});
test('metadata preserves canonical host and locale alternatives', () => {
  const meta = pageMetadata(
    'ar',
    '/book/chest-clavicular-head',
    'title',
    'description',
    'chest-clavicular-head',
  );
  assert.equal(
    meta.alternates?.canonical,
    'https://workout.alile.us/ar/book/chest-clavicular-head',
  );
  assert.equal(
    meta.alternates?.languages?.ja,
    'https://workout.alile.us/ja/book/chest-clavicular-head',
  );
  assert.deepEqual(meta.robots, {
    index: process.env.VERCEL_ENV === 'production',
    follow: process.env.VERCEL_ENV === 'production',
  });
});
test('no-code contribution links prefill stable entry and issue template', () => {
  const url = new URL(suggestionUrl('chest-clavicular-head'));
  assert.equal(url.searchParams.get('entry'), 'chest-clavicular-head');
  assert.equal(url.searchParams.get('template'), 'book-update.yml');
});
