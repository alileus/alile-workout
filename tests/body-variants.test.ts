import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anatomy } from '../src/features/anatomy/model';
import {
  defaultBodyVariant,
  getBodyAnatomy,
  femalePoint,
  femalePath,
} from '../src/features/anatomy/body-variants';

test('male remains the default and female preserves every muscle identity and view', () => {
  assert.equal(defaultBodyVariant, 'male');
  assert.equal(getBodyAnatomy('male'), anatomy);
  const female = getBodyAnatomy('female');
  assert.notEqual(female.silhouette, anatomy.silhouette);
  assert.deepEqual(Object.keys(female.regions), Object.keys(anatomy.regions));
  for (const [id, region] of Object.entries(female.regions)) {
    const original = anatomy.regions[id];
    assert.equal(region.group, original.group);
    assert.equal(region.view, original.view);
    assert.equal(region.deep, original.deep);
    assert.equal(region.component, original.component);
    assert.equal(region.d.length, original.d.length);
    assert.deepEqual(region.d, original.d.map(femalePath));
    for (const path of region.d) assert.ok(!/NaN|Infinity/.test(path), id);
  }
});

test('female geometry stays symmetric and applies distinct torso proportions', () => {
  for (let y = 0; y <= 670; y += 10) {
    assert.deepEqual(femalePoint(200, y), [200, y]);
    for (let x = 40; x <= 200; x += 10) {
      assert.ok(Math.abs(femalePoint(x, y)[0] + femalePoint(400 - x, y)[0] - 400) < 0.02);
    }
  }
  assert.ok(femalePoint(155, 115)[0] > 155, 'narrower shoulder outline');
  assert.ok(femalePoint(140, 320)[0] < 140, 'broader hip outline');
  assert.throws(() => femalePath('M0 0 C1 2 3 4 5 6'), /absolute/);
});

test('female hand and foot cutaways keep transformed detail within their viewBox', () => {
  for (const [id, region] of Object.entries(getBodyAnatomy('female').regions)) {
    if (!region.zoom) continue;
    const [left, top, width, height] = region.zoom.split(' ').map(Number);
    assert.ok(width > 0 && height > 0);
    for (const path of region.d) {
      const coordinates = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      for (let i = 0; i < coordinates.length; i += 2) {
        assert.ok(coordinates[i] >= left - 1 && coordinates[i] <= left + width + 1, id);
        assert.ok(coordinates[i + 1] >= top && coordinates[i + 1] <= top + height, id);
      }
    }
  }
});
