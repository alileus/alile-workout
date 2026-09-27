import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './language-switcher';
export function DocumentShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('App');
  return (
    <main className="document-page">
      <nav className="document-nav">
        <Link href="/">← {t('atlas')}</Link>
        <Link href="/book">{t('book')}</Link>
        <Link href="/contribute">{t('contribute')}</Link>
        <LanguageSwitcher />
      </nav>
      {children}
    </main>
  );
}
