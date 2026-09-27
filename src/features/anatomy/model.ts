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
export function visibleRegions(view: View, activeId: string | null = null) {
  const active = activeId ? anatomy.regions[activeId] : undefined;
  const components = visibleComponents(view, active);
  const regions = Object.entries(anatomy.regions)
    .filter(
      ([id, region]) =>
        id !== activeId &&
        !region.deep &&
        region.view === view &&
        components.includes(region.component) &&
        (!active?.zoom || region.component === active.component),
    )
    .map(([id]) => id);
  // The revealed region sits above superficial hit areas, including deep cutaways.
  return active?.view === view ? [...regions, activeId!] : regions;
}
export function selectRegion(current: string | null, next: string) {
  const region = anatomy.regions[next];
  if (!region) return null;
  return { selected: toggleRegion(current, next), group: region.group, view: region.view as View };
}
