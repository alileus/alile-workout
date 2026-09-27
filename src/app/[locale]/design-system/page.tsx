import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentShell } from '@/components/document-shell';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'DesignSystem' });
  return {
    ...pageMetadata(locale, '/design-system', t('title'), t('intro')),
    robots: { index: false, follow: false },
  };
}
export default async function DesignSystem({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('DesignSystem');
  return (
    <DocumentShell>
      <div>
        <span className="eyebrow">{t('reference')}</span>
        <h1>{t('title')}</h1>
        <p className="muted">{t('intro')}</p>
        <h2>{t('colors')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['background', 'foreground', 'primary', 'muted', 'accent', 'border', 'destructive'].map(
            (token) => (
              <div key={token}>
                <div className="h-16 rounded-lg border" style={{ background: `var(--${token})` }} />
                <p className="mt-2 text-sm">{t(`tokens.${token}`)}</p>
                <code dir="ltr" className="text-xs text-muted-foreground">
                  --{token}
                </code>
              </div>
            ),
          )}
        </div>
        <h2>{t('buttons')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button>{t('primary')}</Button>
          <Button variant="secondary">{t('secondary')}</Button>
          <Button variant="outline">{t('outline')}</Button>
          <Button variant="ghost">{t('ghost')}</Button>
          <Button disabled>{t('disabled')}</Button>
        </div>
        <h2>{t('status')}</h2>
        <div className="flex gap-3">
          <Badge>{t('selected')}</Badge>
          <Badge variant="secondary">{t('deep')}</Badge>
          <Badge variant="outline">{t('draft')}</Badge>
        </div>
        <Separator className="my-8" />
        <h2>{t('typography')}</h2>
        <p className="eyebrow">{t('sectionSample')}</p>
        <p className="my-4">{t('bodySample')}</p>
        <p className="my-4">{t('sample')}</p>
        <h2>{t('interactionTitle')}</h2>
        <p className="muted">{t('interactionBody')}</p>
      </div>
    </DocumentShell>
  );
}
