import { ImageResponse } from 'next/og';
import { anatomy, visibleComponents, type View } from '@/features/anatomy/model';
// Deliberately language-neutral. No Arabic shaping or remote-font dependency.
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('region');
  const region = id && Object.hasOwn(anatomy.regions, id) ? anatomy.regions[id] : undefined;
  if (id && !region) return new Response('Unknown region', { status: 404 });
  const highlight = region?.d || anatomy.paths.chest;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 670"><path d="${anatomy.silhouette}" fill="#333" stroke="#555"/>${visibleComponents(
    (region?.view || 'front') as View,
    region,
  )
    .flatMap((component) => anatomy.paths[component])
    .map(
      (d) =>
        `<path d="${d}" fill="#494949"/><path d="${d}" transform="translate(400 0) scale(-1 1)" fill="#494949"/>`,
    )
    .join(
      '',
    )}${highlight.map((d) => `<path d="${d}" fill="#55c9c3"/><path d="${d}" transform="translate(400 0) scale(-1 1)" fill="#55c9c3"/>`).join('')}</svg>`;
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#171717',
        gap: 100,
      }}
    >
      <div
        style={{
          width: 340,
          height: 340,
          border: '1px solid #353535',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#55c9c3"
          strokeWidth="1.3"
        >
          <path d="M7 3 3 7m14 10 4-4M5 5l14 14M4 11l7-7M13 20l7-7M2 9l7-7m6 20 7-7" />
        </svg>
      </div>
      <div style={{ display: 'flex', height: 590, width: 360 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={uri} width={352} height={590} alt="" />
      </div>
    </div>,
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
