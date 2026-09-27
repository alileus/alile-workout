import { useTranslations } from 'next-intl';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { anatomy, groupPaths, visibleRegions, type View } from '../model';
export function BodyMap({
  group,
  regionId,
  view,
  selectedRegionId,
  regionNames,
  onRegion,
}: {
  group: string | null;
  regionId: string | null;
  view: View;
  selectedRegionId: string | null;
  regionNames: Record<string, string>;
  onRegion: (id: string) => void;
}) {
  const t = useTranslations('App'),
    region = regionId ? anatomy.regions[regionId] : undefined;
  const paths = (list: string[]) => (
    <>
      {list.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <g transform="translate(400 0) scale(-1 1)">
        {list.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </>
  );
  return (
    <TooltipProvider disableHoverableContent>
      <svg
        className={`body-map ${region ? 'has-region' : ''}`}
        viewBox={region?.zoom || '0 0 400 670'}
        aria-label={t('schematic')}
      >
        <image
          className="anatomy-art"
          href={anatomy.artwork[view]}
          x="0"
          y="0"
          width="400"
          height="670"
          aria-hidden="true"
          pointerEvents="none"
        />
        {group && !region && (
          <g className="group-overlay" aria-hidden="true" pointerEvents="none">
            {paths(groupPaths(group, view))}
          </g>
        )}
        {visibleRegions(view, regionId).map((id) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <g
                className="body-region"
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={regionNames[id]}
                aria-pressed={id === selectedRegionId}
                onClick={() => onRegion(id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onRegion(id);
                  }
                }}
              >
                {paths(anatomy.regions[id].d)}
              </g>
            </TooltipTrigger>
            <TooltipContent className="pointer-events-none">{regionNames[id]}</TooltipContent>
          </Tooltip>
        ))}
        {region && (
          <g className={`region-overlay ${region.deep ? 'deep' : ''}`}>{paths(region.d)}</g>
        )}
      </svg>
    </TooltipProvider>
  );
}
