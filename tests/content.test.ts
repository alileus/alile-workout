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
import { anatomy, toggleRegion, selectRegion, visibleRegions } from '../src/features/anatomy/model';
import { musclePath, resolveMuscleRoute } from '../src/features/anatomy/routes';
import { pageMetadata } from '../src/lib/seo';
import { exerciseRelations, guideRelations } from '../src/features/workout-book/relations';
import { workoutCatalog } from '../src/features/workout-book/catalog';
import { muscleCategories, extraMuscles } from '../src/features/workout-book/muscle-categories';
import involvement from '../content/workout-muscles.json';
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
    assert.deepEqual(Object.keys(overlay).sort(), regions.map((region) => region.id).sort());
    const script =
      locale === 'ar'
        ? /\p{Script=Arabic}/u
        : /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
    const assertTranslated = (text: string, original: string, path: string) => {
      if (!original) return assert.equal(text, '', path);
      assert.notEqual(text, original, `Untranslated ${locale} ${path}`);
      assert.match(text, script, `Missing target-language text in ${locale} ${path}`);
    };
    for (const id of Object.keys(overlay))
      assert.ok(getRegion('en', id), `Unknown translation ${id}`);
    let translated = 0;
    for (const group of getBook(locale))
      for (const section of group.sections)
        for (const region of section.regions) {
          const original = getRegion('en', region.id)!.region;
          assert.equal(region.exercises.length, original.exercises.length);
          assert.deepEqual(region.references, original.references);
          assert.equal(region.reviewStatus, original.reviewStatus);
          for (const field of ['name', 'description', 'note'] as const)
            assertTranslated(region[field], original[field], `${region.id}.${field}`);
          region.exercises.forEach((exercise, index) => {
            assert.equal(exercise.id, original.exercises[index].id);
            for (const field of ['name', 'equipment', 'instructions', 'cue'] as const)
              assertTranslated(
                exercise[field],
                original.exercises[index][field],
                `${region.id}.exercises[${index}].${field}`,
              );
          });
          if (hasTranslation(locale, region.id)) translated++;
        }
    assert.equal(translated, regions.length, `${locale} must cover every muscle guide`);
    console.log(`${locale}: ${translated}/${regions.length} book entries fully translated`);
  }
});
const keys = (value: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, v]) =>
    typeof v === 'object' && v !== null
      ? keys(v as Record<string, unknown>, `${prefix}${key}.`)
      : [prefix + key],
  );

test('workout relations link participating guides using stable localized identities', () => {
  const englishRelations = guideRelations(englishBook);
  for (const region of regions) {
    const ids = region.exercises.map((exercise) => exercise.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate workout in ${region.id}`);
    for (const exercise of region.exercises)
      assert.ok(englishRelations.get(exercise.id)?.some((muscle) => muscle.id === region.id));
  }
  assert.deepEqual(
    englishRelations.get('barbell-bench-press')?.map((muscle) => muscle.id),
    ['chest-clavicular-head', 'chest-sternocostal-head'],
  );
  assert.deepEqual(
    englishRelations.get('incline-dumbbell-press')?.map((muscle) => muscle.group),
    ['chest', 'shoulders'],
  );
  assert.equal(englishRelations.get('leg-extension')?.length, 4);
  assert.equal(englishRelations.get('seated-band-hip-external-rotation')?.length, 6);
  assert.equal(englishRelations.get('lat-pulldown')?.length, 1);
  for (const locale of ['en', 'ar', 'ja'] as const) {
    const book = getBook(locale);
    for (const [id, muscles] of guideRelations(book)) {
      assert.deepEqual(
        muscles.map((muscle) => muscle.id),
        englishRelations.get(id)?.map((muscle) => muscle.id),
      );
      assert.equal(new Set(muscles.map((muscle) => muscle.id)).size, muscles.length);
      for (const muscle of muscles) {
        const entry = resolveMuscleRoute(book, [muscle.group, muscle.id]);
        assert.equal(entry?.region?.name, muscle.name);
        assert.ok(entry?.region?.exercises.some((exercise) => exercise.id === id));
      }
    }
  }
});

test('secondary muscles resolve to exact guides, translated families or named muscles', () => {
  const ids = new Set(regions.map((r) => r.id));
  const workouts = workoutCatalog(englishBook, 'en');
  assert.equal(workouts.length, 79);
  assert.deepEqual(Object.keys(involvement).sort(), workouts.map((w) => w.id).sort());
  for (const targets of Object.values(involvement))
    for (const target of targets) {
      const [kind, key] = target.split(':');
      if (kind === 'category') assert.ok(muscleCategories[key], target);
      else if (kind === 'extra') assert.ok(extraMuscles[key], target);
      else assert.ok(ids.has(target), target);
    }
  for (const locale of ['en', 'ar', 'ja'] as const) {
    const catalog = workoutCatalog(getBook(locale), locale);
    assert.equal(catalog.length, workouts.length);
    assert.equal(new Set(catalog.map((w) => w.id)).size, catalog.length);
    assert.deepEqual(catalog.map((w) => w.id).sort(), workouts.map((w) => w.id).sort());
    const messages = JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8'));
    for (const workout of catalog) {
      assert.equal(new Set(workout.muscles.map((m) => m.id)).size, workout.muscles.length);
      for (const muscle of workout.muscles) {
        if (muscle.labelKey) assert.ok(messages.App.involvement[muscle.labelKey]);
        if (muscle.href?.split('/').length === 4)
          assert.ok(resolveMuscleRoute(getBook(locale), muscle.href.split('/').slice(2)));
      }
    }
  }
  const bench = exerciseRelations(englishBook).get('barbell-bench-press')!;
  assert.ok(bench.some((m) => m.id === 'shoulders-anterior-deltoid'));
  assert.ok(bench.some((m) => m.id === 'category:triceps'));
});
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

test('diagram selection resolves exact muscles, including revealed deep layers', () => {
  for (const region of regions) {
    const geometry = anatomy.regions[region.id];
    assert.deepEqual(selectRegion(null, region.id), {
      selected: region.id,
      group: geometry.group,
      view: geometry.view,
    });
    assert.equal(selectRegion(region.id, region.id)?.selected, null);
    assert.equal(visibleRegions(geometry.view as 'front' | 'back', region.id).at(-1), region.id);
    if (geometry.deep)
      assert.ok(!visibleRegions(geometry.view as 'front' | 'back').includes(region.id));
  }
  assert.equal(selectRegion(null, 'unknown'), null);
});

test('share routes round-trip every group and muscle and reject incorrect group URLs', () => {
  const paths = new Set<string>();
  for (const group of englishBook) {
    paths.add(musclePath(group.id));
    assert.equal(resolveMuscleRoute(englishBook, [group.id])?.group.id, group.id);
    for (const section of group.sections)
      for (const region of section.regions) {
        const path = musclePath(group.id, region.id);
        paths.add(path);
        assert.equal(
          resolveMuscleRoute(englishBook, path.split('/').slice(2))?.region?.id,
          region.id,
        );
        const otherGroup = englishBook.find((entry) => entry.id !== group.id)!;
        assert.equal(resolveMuscleRoute(englishBook, [otherGroup.id, region.id]), undefined);
      }
  }
  assert.equal(paths.size, englishBook.length + regions.length);
  for (const slug of [[], ['unknown'], ['chest', 'unknown'], ['chest', regions[0].id, 'extra']])
    assert.equal(resolveMuscleRoute(englishBook, slug), undefined);
});
test('metadata preserves canonical host and locale alternatives', () => {
  const meta = pageMetadata(
    'ar',
    '/muscles/chest/chest-clavicular-head',
    'title',
    'description',
    'chest-clavicular-head',
  );
  assert.equal(
    meta.alternates?.canonical,
    'https://workout.alile.us/ar/muscles/chest/chest-clavicular-head',
  );
  assert.equal(
    meta.alternates?.languages?.ja,
    'https://workout.alile.us/ja/muscles/chest/chest-clavicular-head',
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
