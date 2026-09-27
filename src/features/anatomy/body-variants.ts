import { anatomy } from './model';

export type BodyVariant = 'male' | 'female';
export const defaultBodyVariant: BodyVariant = 'male';

// Art proportions for the schematic, not measurements or a separate muscle catalog.
// Apply the same deformation to the outline, muscles, hit areas and cutaways.
const profile = [
  [0, 0.95],
  [48, 0.95],
  [80, 0.88],
  [98, 0.94],
  [115, 0.9],
  [175, 0.93],
  [210, 0.88],
  [245, 0.85],
  [280, 1.02],
  [320, 1.04],
  [365, 1.02],
  [440, 0.98],
  [520, 0.96],
  [670, 0.97],
] as const;

export function femalePoint(x: number, y: number): [number, number] {
  const upper = profile.findIndex(([height]) => height >= y);
  const [y1, s1] = profile[Math.max(0, upper - 1)];
  const [y2, s2] = profile[upper < 0 ? profile.length - 1 : upper];
  const blend = y2 === y1 ? 0 : Math.max(0, Math.min(1, (y - y1) / (y2 - y1)));
  const scale = s1 + (s2 - s1) * blend;
  const distance = Math.abs(x - 200);
  const torsoWeight = Math.max(0, Math.min(1, (120 - distance) / 34));
  const width = 0.92 + (scale - 0.92) * torsoWeight;
  const mappedX = 200 + (x - 200) * width;
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const handWeight = clamp((y - 288) / 12) * clamp((348 - y) / 12) * clamp((distance - 105) / 20);
  const handCenter = 200 + Math.sign(x - 200) * 132 * 0.92;
  const shapedX = handCenter + (mappedX - handCenter) * (1 - 0.18 * handWeight);
  return [Math.round(shapedX * 100) / 100, y];
}

export function femalePath(path: string) {
  if (/[^MLQZ\d\s,.-]/.test(path))
    throw new Error('Body variants support absolute M/L/Q/Z paths only.');
  return path.replace(/(-?\d+(?:\.\d+)?)\s*,?\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) =>
    femalePoint(Number(x), Number(y)).join(' '),
  );
}

function femaleZoom(zoom: string) {
  const [x, y, width, height] = zoom.split(' ').map(Number);
  const edges = Array.from({ length: Math.ceil(height) + 1 }, (_, index) =>
    Math.min(y + index, y + height),
  ).flatMap((row) => [femalePoint(x, row)[0], femalePoint(x + width, row)[0]]);
  const left = Math.min(...edges);
  return `${left} ${y} ${Math.max(...edges) - left} ${height}`;
}

const femaleAnatomy: typeof anatomy = {
  ...anatomy,
  silhouette: femalePath(anatomy.silhouette),
  paths: Object.fromEntries(
    Object.entries(anatomy.paths).map(([key, paths]) => [key, paths.map(femalePath)]),
  ),
  regions: Object.fromEntries(
    Object.entries(anatomy.regions).map(([key, region]) => [
      key,
      {
        ...region,
        d: region.d.map(femalePath),
        ...(region.zoom ? { zoom: femaleZoom(region.zoom) } : {}),
      },
    ]),
  ),
};

export function getBodyAnatomy(variant: BodyVariant) {
  return variant === 'female' ? femaleAnatomy : anatomy;
}
