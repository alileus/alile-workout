import { useTranslations } from 'next-intl';
import { anatomy, visibleComponents, type View } from '../model';
export function BodyMap({
  group,
  regionId,
  view,
  onGroup,
}: {
  group: string | null;
  regionId: string | null;
  view: View;
  onGroup: (id: string) => void;
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
    <svg
      className={`body-map ${region ? 'has-region' : ''}`}
      viewBox={region?.zoom || '0 0 400 670'}
      aria-label={t('schematic')}
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
      <path d={anatomy.silhouette} fill="url(#body)" stroke="#595959" />
      {view === 'front' && (
        <path
          d="M180 49 Q186 42 192 49 M207 49 Q216 42 221 49 M193 73 Q200 76 207 73 M200 53L197 64 203 64 M185 83L200 91 215 83"
          fill="none"
          stroke="#666"
        />
      )}
      {visibleComponents(view, region).map((component) => {
        const id = anatomy.componentGroup[component];
        return (
          <g
            key={component}
            className={`body-muscle ${id === group && !region ? 'active' : ''}`}
            fill="url(#muscle)"
            role="button"
            tabIndex={0}
            aria-label={t(id === 'back' ? 'backGroup' : id)}
            aria-pressed={id === group}
            onClick={() => onGroup(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onGroup(id);
              }
            }}
          >
            {paths(anatomy.paths[component])}
          </g>
        );
      })}
      {region && (
        <g className={`region-overlay ${region.deep ? 'deep' : ''}`} fill="url(#selected)">
          {paths(region.d)}
        </g>
      )}
    </svg>
  );
}
