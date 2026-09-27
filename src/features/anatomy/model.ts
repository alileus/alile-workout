import geometry from './data/geometry.json';
import alignment from './data/alignment.json';
export type View = 'front' | 'back';
// Keep the independently traced views on the same head center and crown-to-sole frame.
export function artworkTransform(view: View) {
  const { x, y, scaleY } = alignment[view];
  return `translate(${x} ${y}) scale(1 ${scaleY})`;
}
export function artworkViewBox(view: View, zoom?: string) {
  if (!zoom) return '0 0 400 670';
  const [left, top, width, height] = zoom.split(' ').map(Number);
  const { x, y, scaleY } = alignment[view];
  return `${left + x} ${top * scaleY + y} ${width} ${height * scaleY}`;
}
export function resolveArtworkView(requested: View, ready: Record<View, boolean>): View {
  if (ready[requested]) return requested;
  const previous = requested === 'front' ? 'back' : 'front';
  return ready[previous] ? previous : requested;
}
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
  artwork: Record<View, string>;
  paths: Record<string, string[]>;
  componentGroup: Record<string, string>;
  regions: Record<string, RegionGeometry>;
};
export function toggleRegion(current: string | null, next: string) {
  return current === next ? null : next;
}
export function visibleRegions(view: View, activeId: string | null = null) {
  const active = activeId ? anatomy.regions[activeId] : undefined;
  const regions = Object.entries(anatomy.regions)
    .filter(
      ([id, region]) =>
        id !== activeId &&
        !region.deep &&
        region.view === view &&
        (!active?.zoom || region.component === active.component),
    )
    .map(([id]) => id);
  // The revealed region sits above superficial hit areas, including deep cutaways.
  return active?.view === view ? [...regions, activeId!] : regions;
}
export function groupPaths(group: string, view: View) {
  return Object.values(anatomy.regions)
    .filter((region) => region.group === group && region.view === view && !region.deep)
    .flatMap((region) => region.d);
}
export function selectRegion(current: string | null, next: string) {
  const region = anatomy.regions[next];
  if (!region) return null;
  return { selected: toggleRegion(current, next), group: region.group, view: region.view as View };
}
