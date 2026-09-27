import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  anatomy,
  groupPaths,
  resolveArtworkView,
  visibleRegions,
} from '../src/features/anatomy/model';

test('switching anatomy waits for the requested image without blanking the loaded view', () => {
  assert.equal(resolveArtworkView('back', { front: true, back: false }), 'front');
  assert.equal(resolveArtworkView('front', { front: false, back: true }), 'back');
  assert.equal(resolveArtworkView('back', { front: true, back: true }), 'back');
  assert.equal(resolveArtworkView('front', { front: true, back: true }), 'front');
  assert.equal(resolveArtworkView('back', { front: false, back: false }), 'back');
});

test('every mirrored highlight and its stroke stay inside the actual artwork', () => {
  execFileSync(process.execPath, ['scripts/audit-anatomy.mjs'], { encoding: 'utf8' });
});

test('both anatomy views are self-contained vector artwork', () => {
  for (const view of ['front', 'back'] as const) {
    const svg = readFileSync(`public${anatomy.artwork[view]}`, 'utf8');
    assert.match(svg, /viewBox="0 0 400 670"/);
    assert.ok((svg.match(/<path\b/g) || []).length > 100);
    assert.doesNotMatch(svg, /<image\b|<script\b|data:image|https?:\/\/(?!www\.w3\.org)/);
  }
});

test('new region geometry fits the artwork and hand/foot detail windows', () => {
  for (const [id, region] of Object.entries(anatomy.regions)) {
    const [left, top, width, height] = region.zoom?.split(' ').map(Number) || [0, 0, 400, 670];
    for (const path of region.d) {
      assert.doesNotMatch(path, /NaN|Infinity/);
      const coords = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      assert.equal(coords.length % 2, 0, id);
      for (let i = 0; i < coords.length; i += 2) {
        assert.ok(coords[i] >= left && coords[i] <= left + width, `${id}: x=${coords[i]}`);
        assert.ok(
          coords[i + 1] >= top && coords[i + 1] <= top + height,
          `${id}: y=${coords[i + 1]}`,
        );
      }
    }
  }
});

test('every superficial muscle is reachable and group highlights respect front/back', () => {
  for (const [id, region] of Object.entries(anatomy.regions)) {
    const view = region.view as 'front' | 'back';
    if (region.deep) continue;
    assert.ok(visibleRegions(view).includes(id), id);
    assert.ok(!visibleRegions(view === 'front' ? 'back' : 'front').includes(id), id);
    for (const path of region.d) assert.ok(groupPaths(region.group, view).includes(path), id);
  }
  assert.ok(!groupPaths('legs', 'front').includes(anatomy.regions['glutes-gluteus-maximus'].d[0]));
  assert.ok(!groupPaths('legs', 'back').includes(anatomy.regions['quads-rectus-femoris'].d[0]));
});
