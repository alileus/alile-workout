import { useTranslations } from 'next-intl';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { visibleComponents, visibleRegions, type View } from '../model';
import { getBodyAnatomy, femalePath, type BodyVariant } from '../body-variants';
import { HairBehind, BodyHair } from './body-hair';
export function BodyMap({
  group,
  regionId,
  view,
  selectedRegionId,
  regionNames,
  onRegion,
  bodyVariant,
}: {
  group: string | null;
  regionId: string | null;
  view: View;
  selectedRegionId: string | null;
  regionNames: Record<string, string>;
  onRegion: (id: string) => void;
  bodyVariant: BodyVariant;
}) {
  const anatomy = getBodyAnatomy(bodyVariant);
  const face =
    'M180 49 Q186 42 192 49 M207 49 Q216 42 221 49 M193 73 Q200 76 207 73 M200 53L197 64 203 64 M185 83L200 91 215 83';
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
    <TooltipProvider>
      <svg
        className={`body-map ${region ? 'has-region' : ''}`}
        viewBox={region?.zoom || '0 0 400 670'}
        aria-label={t('bodyDiagram', { body: t(bodyVariant), view: t(view) })}
        data-body-variant={bodyVariant}
      >
        <defs>
          <linearGradient id="body" x2="1">
            <stop stopColor="#252525" />
            <stop offset=".5" stopColor="#444" />
            <stop offset="1" stopColor="#252525" />
          </linearGradient>
          <linearGradient id="muscle" x2="1" y2=".7">
            <stop stopColor="#626262" />
            <stop offset=".5" stopColor="#777" />
            <stop offset="1" stopColor="#494949" />
          </linearGradient>
          <linearGradient id="selected" x2="1" y2="1">
            <stop stopColor="#a3e6df" />
            <stop offset="1" stopColor="#329e9f" />
          </linearGradient>
        </defs>
        <HairBehind bodyVariant={bodyVariant} />
        <path d={anatomy.silhouette} fill="url(#body)" stroke="#595959" />
        {view === 'front' && (
          <path d={bodyVariant === 'female' ? femalePath(face) : face} fill="none" stroke="#666" />
        )}
        <BodyHair bodyVariant={bodyVariant} view={view} />
        {visibleComponents(view, region).map((component) => {
          const id = anatomy.componentGroup[component];
          return (
            <g
              key={component}
              className={`body-muscle ${id === group && !region ? 'active' : ''}`}
              fill="url(#muscle)"
              aria-hidden="true"
            >
              {paths(anatomy.paths[component])}
            </g>
          );
        })}
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
            <TooltipContent>{regionNames[id]}</TooltipContent>
          </Tooltip>
        ))}
        {region && (
          <g className={`region-overlay ${region.deep ? 'deep' : ''}`} fill="url(#selected)">
            {paths(region.d)}
          </g>
        )}
      </svg>
    </TooltipProvider>
  );
}
