import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentShell } from '@/components/document-shell';
export const metadata = { title: 'Design system', robots: { index: false, follow: false } };
export default async function DesignSystem({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <DocumentShell>
      <div lang="en" dir="ltr">
        <span className="eyebrow">Contributor reference</span>
        <h1>Design system</h1>
        <p className="muted">
          Neutral surfaces, teal interactions, logical spacing. Shared shadcn/ui primitives.
        </p>
        <h2>Color tokens</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['background', 'foreground', 'primary', 'muted', 'accent', 'border', 'destructive'].map(
            (token) => (
              <div key={token}>
                <div className="h-16 rounded-lg border" style={{ background: `var(--${token})` }} />
                <p className="mt-2 text-sm">{token}</p>
              </div>
            ),
          )}
        </div>
        <h2>Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <h2>Status</h2>
        <div className="flex gap-3">
          <Badge>Selected</Badge>
          <Badge variant="secondary">Deep layer</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
        <Separator className="my-8" />
        <h2>Type & direction</h2>
        <p className="eyebrow">Section label / 11 px</p>
        <p className="my-4">Body copy / 15 px / comfortable line height</p>
        <p lang="ar" dir="rtl" className="my-4">
          اختر منطقة عضلية لاستكشاف التمارين.
        </p>
        <p lang="ja" className="my-4">
          筋肉の部位を選択してください。
        </p>
        <h2>Interaction rules</h2>
        <p className="muted">
          Hover previews anatomy. Click toggles the pinned region. Focus uses the same color cues.
          Keep anatomy unmirrored in RTL.
        </p>
      </div>
    </DocumentShell>
  );
}
