'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
export function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale(),
    pathname = usePathname(),
    t = useTranslations('App');
  return (
    <nav className="language-switcher" aria-label={t('language')}>
      {routing.locales.map((lang) => (
        <Button key={lang} asChild variant={locale === lang ? 'default' : 'ghost'}>
          <Link
            href={pathname}
            locale={lang}
            hrefLang={lang}
            lang={lang}
            aria-current={locale === lang ? 'page' : undefined}
            onClick={onNavigate}
          >
            {{ en: 'English', ar: 'العربية', ja: '日本語' }[lang]}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
