import geometry from './data/geometry.json';
export type View = 'front' | 'back';
export type RegionGeometry = {
  d: string[];
  view: string;
  deep?: boolean;
  component: string;
  group: string;
  zoom?: string;
  zoomLabel?: string;
};
export const anatomy = geometry as {
  silhouette: string;
  paths: Record<string, string[]>;
  componentGroup: Record<string, string>;
  regions: Record<string, RegionGeometry>;
};
export function visibleComponents(view: View, region?: RegionGeometry) {
  const base =
    view === 'front'
      ? [
          'shoulders',
          'chest',
          'biceps',
          'forearms',
          'core',
          'quads',
          'neck',
          'serratus',
          'hands',
          'adductors',
          'lowerleg',
        ]
      : [
          'shoulders',
          'back',
          'traps',
          'triceps',
          'forearms',
          'glutes',
          'hamstrings',
          'calves',
          'hands',
        ];
  return region && !base.includes(region.component) ? [...base, region.component] : base;
}
export function toggleRegion(current: string | null, next: string) {
  return current === next ? null : next;
}
