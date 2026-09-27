import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { anatomy, groupPaths, type View } from '@/features/anatomy/model';
import { englishBook } from '@/features/workout-book/data';
// Deliberately language-neutral. No Arabic shaping or remote-font dependency.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = params.get('region');
  const groupId = params.get('group');
  const group = englishBook.find((entry) => entry.id === groupId);
  const region = id && Object.hasOwn(anatomy.regions, id) ? anatomy.regions[id] : undefined;
  if (id && !region) return new Response('Unknown region', { status: 404 });
  if (groupId && !group) return new Response('Unknown group', { status: 404 });
  const view = (region?.view || group?.view || 'front') as View;
  const highlight = region?.d || groupPaths(group?.id || 'chest', view);
  const artwork = await readFile(join(process.cwd(), 'public', anatomy.artwork[view]), 'utf8');
  const overlay = highlight
    .map((d) => `<path d="${d}"/><path d="${d}" transform="translate(400 0) scale(-1 1)"/>`)
    .join('');
  const svg = artwork.replace(
    '</svg>',
    `<g fill="#d4af72" fill-opacity="0.48" stroke="#f0d5a5" stroke-width="0.6">${overlay}</g></svg>`,
  );
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#161513',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={uri} width={352} height={590} alt="" />
    </div>,
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
