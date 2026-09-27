import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
export function DocumentShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('App');
  return (
    <main className="document-page">
      <nav className="document-nav">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="back-icon" aria-hidden="true" />
            {t('atlas')}
          </Link>
        </Button>
      </nav>
      {children}
    </main>
  );
}
