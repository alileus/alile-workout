import { useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { useTranslations } from 'next-intl';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  anatomy,
  artworkTransform,
  artworkViewBox,
  groupPaths,
  resolveArtworkView,
  visibleRegions,
  type View,
} from '../model';
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
  const t = useTranslations('App');
  const [ready, setReady] = useState<Record<View, boolean>>({ front: false, back: false });
  for (const side of ['front', 'back'] as const) {
    preload(anatomy.artwork[side], { as: 'image' });
  }
  useEffect(() => {
    let cancelled = false;
    for (const side of ['front', 'back'] as const) {
      const image = new Image();
      image.src = anatomy.artwork[side];
      // Decode before revealing the matching highlights, including cached images.
      void image
        .decode()
        .then(() => {
          if (!cancelled) setReady((current) => ({ ...current, [side]: true }));
        })
        .catch(() => {
          // Keep the loaded view visible if the other asset cannot be loaded.
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);
  const displayView = resolveArtworkView(view, ready);
  const showRegions = ready[view];
  const region = showRegions && regionId ? anatomy.regions[regionId] : undefined;
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
        viewBox={artworkViewBox(displayView, region?.zoom)}
        aria-label={t('schematic')}
        aria-busy={!ready[view]}
      >
        <g transform={artworkTransform(displayView)}>
          {(['front', 'back'] as const).map((side) => (
            <image
              key={side}
              className="anatomy-art"
              href={anatomy.artwork[side]}
              visibility={side === displayView ? 'visible' : 'hidden'}
              x="0"
              y="0"
              width="400"
              height="670"
              aria-hidden="true"
              pointerEvents="none"
            />
          ))}
          {showRegions && group && !region && (
            <g className="group-overlay" aria-hidden="true" pointerEvents="none">
              {paths(groupPaths(group, view))}
            </g>
          )}
          {(showRegions ? visibleRegions(view, regionId) : []).map((id) => (
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
        </g>
      </svg>
    </TooltipProvider>
  );
}
