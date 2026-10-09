import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { englishBook } from '../src/features/workout-book/data';
import { workoutCatalog } from '../src/features/workout-book/catalog';
import artwork from '../src/features/workout-book/artwork.json';

test('every distinct workout has a documented two-pose vector illustration', () => {
  const ids = workoutCatalog(englishBook, 'en')
    .map((workout) => workout.id)
    .sort();
  assert.deepEqual([...artwork].sort(), ids);
  const manifest = JSON.parse(fs.readFileSync('docs/artwork/workout-prompts.json', 'utf8'));
  assert.deepEqual(Object.keys(manifest.workouts).sort(), ids);
  for (const id of ids) {
    const svg = fs.readFileSync(`public/workouts/${id}.svg`, 'utf8');
    assert.match(svg, /viewBox="0 0 1152 768"/, id);
    assert.match(svg, /<title>.+start and finish<\/title>/, id);
    assert.match(svg, /<path /, id);
    assert.doesNotMatch(svg, /<image\b|data:image|<script\b|\bhref=/i, id);
    assert.ok(fs.statSync(`docs/artwork/workouts/${id}.png`).size > 0, id);
    assert.ok(manifest.workouts[id].prompt, `Missing prompt for ${id}`);
  }
});
