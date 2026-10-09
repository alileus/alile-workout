'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowUpRight, Search, Layers, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { musclePath } from '../routes';
import { MovementGuide } from '@/features/workout-book/components/movement-guide';
import type { Book } from '@/features/workout-book/schema';
import { suggestionUrl } from '@/features/workout-book/data';
import { BodyMap } from './body-map';
import { anatomy, selectRegion, type View } from '../model';
import { useCompactAnatomy } from '../use-compact-anatomy';
export function Atlas({
  book,
  groupId = null,
  selected = null,
}: {
  book: Book;
  groupId?: string | null;
  selected?: string | null;
}) {
  const router = useRouter();
  const { compact, toggle: toggleCompact } = useCompactAnatomy();
  const anatomyId = useId();
  const groupButtons = useRef<HTMLDivElement>(null);
  const t = useTranslations('App'),
    locale = useLocale();
  const routeKey = musclePath(groupId, selected);
  const [previousRoute, setPreviousRoute] = useState(routeKey);
  const [hovered, setHovered] = useState<string | null>(null),
    [viewChoice, setViewChoice] = useState<{ route: string; view: View }>(() => ({
      route: routeKey,
      view: (anatomy.regions[selected || '']?.view ||
        book.find((entry) => entry.id === groupId)?.view ||
        'front') as View,
    })),
    [search, setSearch] = useState('');
  // Clear route-specific interactions without remounting the shared anatomy.
  if (previousRoute !== routeKey) {
    setPreviousRoute(routeKey);
    setHovered(null);
    setSearch('');
  }
  const group = book.find((g) => g.id === groupId),
    activeId = hovered || selected,
    active = activeId ? anatomy.regions[activeId] : undefined;
  const region = group?.sections.flatMap((s) => s.regions).find((r) => r.id === selected);
  const activeRegion = group?.sections.flatMap((s) => s.regions).find((r) => r.id === activeId);
  // A manual rotation belongs to the current selection. New routes use their muscle's side.
  const view =
    viewChoice.route === routeKey
      ? viewChoice.view
      : ((anatomy.regions[selected || '']?.view || group?.view || 'front') as View);
  const displayView = (hovered ? active?.view || view : view) as View;
  const visibleActiveId = active?.view === displayView ? activeId : null;
  const chooseGroup = () => {
    setHovered(null);
    setSearch('');
  };
  const chooseRegion = (id: string) => {
    const next = selectRegion(selected, id);
    if (!next) return;
    router.push(musclePath(next.group, next.selected), { scroll: false });
    setHovered(null);
    setSearch('');
  };
  const regionNames = Object.fromEntries(
    book.flatMap((g) => g.sections.flatMap((s) => s.regions.map((r) => [r.id, r.name]))),
  );
  const label = (id: string) => t(id === 'back' ? 'backGroup' : id);
  useLayoutEffect(() => {
    // Mobile uses document scrolling so Safari can display content behind its toolbar.
    if (window.matchMedia('(max-width: 1000px)').matches) window.scrollTo(0, 0);
  }, [routeKey]);
  useEffect(() => {
    groupButtons.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [groupId]);
  return (
    <main
      className={`atlas ${compact ? 'anatomy-compact' : ''} ${region ? 'guide-open' : ''} ${!group ? 'atlas-home' : ''}`}
    >
      <h1 className="sr-only">{region?.name || (group ? label(group.id) : t('title'))}</h1>
      <div className="atlas-preview">
        <nav className="group-bar" aria-label={t('groups')}>
          <div className="group-buttons" ref={groupButtons}>
            {book.map((g) => (
              <Button variant={g.id === groupId ? 'default' : 'outline'} key={g.id} asChild>
                <Link
                  href={musclePath(g.id === groupId ? null : g.id)}
                  scroll={false}
                  aria-current={g.id === groupId ? 'page' : undefined}
                  onClick={chooseGroup}
                >
                  {label(g.id)}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
        <section id={anatomyId} className="anatomy-panel" aria-label={t('atlas')}>
          <span className="anatomy-caption eyebrow">{t('schematic')}</span>
          <Button
            className="anatomy-size-toggle"
            variant="outline"
            size="icon"
            aria-label={t(compact ? 'expandAnatomy' : 'collapseAnatomy')}
            aria-expanded={!compact}
            aria-controls={anatomyId}
            onClick={toggleCompact}
          >
            {compact ? <Maximize2 aria-hidden="true" /> : <Minimize2 aria-hidden="true" />}
          </Button>
          <BodyMap
            group={activeId ? null : groupId}
            regionId={visibleActiveId}
            selectedRegionId={selected}
            regionNames={regionNames}
            view={displayView}
            onRegion={chooseRegion}
          />
          <div className="anatomy-bottom">
            <div className="region-label" aria-live="polite">
              {visibleActiveId && active?.deep && <span className="eyebrow">{t('deep')}</span>}
              {visibleActiveId && activeRegion?.name}
            </div>
            <div className="view-switch" role="group" aria-label={t('atlas')}>
              {(['front', 'back'] as const).map((side) => (
                <Button
                  key={side}
                  variant={displayView === side ? 'default' : 'ghost'}
                  aria-pressed={displayView === side}
                  onClick={() => {
                    setViewChoice({ route: routeKey, view: side });
                    setHovered(null);
                  }}
                >
                  {t(side)}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="regions-panel" aria-label={t('regions')}>
        {!group ? (
          <div className="atlas-intro">
            <span className="eyebrow">{t('intro.eyebrow')}</span>
            <h2>{t('intro.title')}</h2>
            <p className="intro-description">{t('intro.description')}</p>
            <ol className="intro-steps">
              {(['choose', 'explore', 'learn'] as const).map((step, index) => (
                <li key={step}>
                  <span className="intro-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <h3>{t(`intro.${step}.title`)}</h3>
                    <p>{t(`intro.${step}.description`)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="intro-note">
              <p>{t('intro.community')}</p>
              <Button asChild variant="outline">
                <Link href="/contribute">{t('contribute')}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="section-top">
              <h2>{group ? label(group.id) : t('groups')}</h2>
              <Button asChild variant="outline" size="sm">
                <a
                  href={suggestionUrl(selected || groupId || undefined)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('suggest')}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
            {group && (
              <>
                <label className="search-field">
                  <Search size={16} />
                  <input
                    aria-label={t('search')}
                    placeholder={t('search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                {group.sections.map((section) => {
                  const regions = section.regions.filter((r) =>
                    `${r.name} ${r.description}`
                      .toLocaleLowerCase(locale)
                      .includes(search.toLocaleLowerCase(locale)),
                  );
                  return (
                    regions.length > 0 && (
                      <section className="region-section" key={section.name}>
                        <h3>
                          {t.has(`sectionNames.${section.name}`)
                            ? t(`sectionNames.${section.name}`)
                            : section.name}
                        </h3>
                        {regions.map((r) => (
                          <Link
                            className="region-button"
                            href={musclePath(group.id, r.id === selected ? null : r.id)}
                            scroll={false}
                            key={r.id}
                            aria-current={r.id === selected ? 'page' : undefined}
                            onPointerEnter={(e) => {
                              if (e.pointerType !== 'touch') setHovered(r.id);
                            }}
                            onPointerLeave={() => setHovered(null)}
                            onFocus={() => setHovered(r.id)}
                            onBlur={() => setHovered(null)}
                            onClick={() => {
                              setHovered(null);
                              setSearch('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                router.push(musclePath(groupId), { scroll: false });
                                setHovered(null);
                              }
                            }}
                          >
                            <span>{r.name}</span>
                            <span className="region-indicator" aria-hidden="true">
                              {r.id === selected ? '−' : '+'}
                            </span>
                          </Link>
                        ))}
                      </section>
                    )
                  );
                })}
                {!group.sections.some((s) =>
                  s.regions.some((r) =>
                    `${r.name} ${r.description}`
                      .toLocaleLowerCase(locale)
                      .includes(search.toLocaleLowerCase(locale)),
                  ),
                ) && <p className="muted">{t('empty')}</p>}
              </>
            )}
          </>
        )}
      </section>
      <section key={selected || 'empty'} className="guide-panel" aria-label={t('guide')}>
        {region ? (
          <>
            <Button
              className="mobile-back"
              variant="outline"
              onClick={() => {
                router.push(musclePath(groupId), { scroll: false });
                setHovered(null);
              }}
            >
              <ArrowLeft className="back-icon" aria-hidden="true" />
              {t('backRegions')}
            </Button>
            <MovementGuide region={region} book={book} />
          </>
        ) : (
          <div className="guide-empty">
            <span className="empty-icon" aria-hidden="true">
              <Layers size={18} />
            </span>
            <h2>{t('guide')}</h2>
            <p>{t('choose')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
