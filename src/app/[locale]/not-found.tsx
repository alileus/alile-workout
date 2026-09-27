import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <main className="document-page">
      <h1>{t('title')}</h1>
      <p className="mb-6 text-muted-foreground">{t('description')}</p>
      <Button asChild variant="outline">
        <Link href="/">
          <ArrowLeft className="back-icon" aria-hidden="true" />
          {t('back')}
        </Link>
      </Button>
    </main>
  );
}
