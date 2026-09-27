'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BookOpen, CodeXml, Layers, Minus, Plus, Users, ArrowUpRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';

export function NavigationDrawer() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('App'),
    locale = useLocale(),
    pathname = usePathname();
  const routes = [
    { href: '/book', label: t('book'), icon: BookOpen },
    { href: '/', label: t('atlas'), icon: Layers },
    { href: '/contribute', label: t('contribute'), icon: Users },
  ];
  return (
    <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="navigation-trigger"
          size="icon"
          aria-label={t('openNavigation')}
          title={t('openNavigation')}
        >
          <Plus aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="navigation-drawer" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="navigation-inner">
          <div className="navigation-heading">
            <DrawerTitle>{t('navigation')}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="outline" size="icon" aria-label={t('closeNavigation')}>
                <Minus aria-hidden="true" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t('navigationDescription')}</DrawerDescription>
          <nav aria-label={t('navigation')} className="navigation-routes">
            {routes.map(({ href, label, icon: Icon }) => (
              <Button
                key={href}
                asChild
                variant={href === '/book' ? 'default' : 'outline'}
                className="navigation-route"
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
                      ? 'page'
                      : undefined
                  }
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
          <div className="navigation-settings">
            <div className="navigation-languages">
              <span className="eyebrow">{t('language')}</span>
              <LanguageSwitcher onNavigate={() => setOpen(false)} />
            </div>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/alileus/alile-workout"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                <CodeXml aria-hidden="true" />
                GitHub
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
