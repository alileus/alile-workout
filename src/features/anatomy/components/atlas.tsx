'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovementGuide } from '@/features/workout-book/components/movement-guide';
import type { Book } from '@/features/workout-book/schema';
import { BodyMap } from './body-map';
import { anatomy, toggleRegion, type View } from '../model';
export function Atlas({ book }: { book: Book }) {
  const t = useTranslations('App'),
    locale = useLocale();
  const [groupId, setGroup] = useState<string | null>('chest'),
    [selected, setSelected] = useState<string | null>(null),
    [hovered, setHovered] = useState<string | null>(null),
    [view, setView] = useState<View>('front'),
    [search, setSearch] = useState('');
  const group = book.find((g) => g.id === groupId),
    activeId = hovered || selected,
    active = activeId ? anatomy.regions[activeId] : undefined;
  const region = group?.sections.flatMap((s) => s.regions).find((r) => r.id === selected);
  const activeRegion = group?.sections.flatMap((s) => s.regions).find((r) => r.id === activeId);
  const displayView = (active?.view || view) as View;
  const chooseGroup = (id: string) => {
    setGroup((current) => (current === id ? null : id));
    setSelected(null);
    setHovered(null);
    setSearch('');
    const next = book.find((g) => g.id === id);
    if (next) setView(next.view);
  };
  const label = (id: string) => t(id === 'back' ? 'backGroup' : id);
  return (
    <main className={`atlas ${region ? 'guide-open' : ''}`}>
      <h1 className="sr-only">{t('title')}</h1>
      <section className="anatomy-panel" aria-label={t('atlas')}>
        <span className="anatomy-caption eyebrow">{t('schematic')}</span>
        <div className="anatomy-circles" aria-hidden="true" />
        <BodyMap group={groupId} regionId={activeId} view={displayView} onGroup={chooseGroup} />
        <div className="anatomy-bottom">
          <div className="region-label" aria-live="polite">
            {active?.deep && <span className="eyebrow">{t('deep')}</span>}
            {activeRegion?.name}
          </div>
          <div className="view-switch" role="group" aria-label={t('atlas')}>
            {(['front', 'back'] as const).map((side) => (
              <Button
                key={side}
                variant={displayView === side ? 'default' : 'ghost'}
                aria-pressed={displayView === side}
                onClick={() => {
                  setView(side);
                  setSelected(null);
                  setHovered(null);
                }}
              >
                {t(side)}
              </Button>
            ))}
          </div>
        </div>
      </section>
      <nav className="group-bar" aria-label={t('groups')}>
        <div className="group-buttons">
          {book.map((g) => (
            <Button
              variant={g.id === groupId ? 'default' : 'outline'}
              key={g.id}
              aria-pressed={g.id === groupId}
              onClick={() => chooseGroup(g.id)}
            >
              {label(g.id)}
            </Button>
          ))}
        </div>
      </nav>
      <section className="regions-panel" aria-label={t('regions')}>
        <div className="section-top">
          <span className="eyebrow">{t('regions')}</span>
        </div>
        <h2>{group ? label(group.id) : t('groups')}</h2>
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
                      <button
                        className="region-button"
                        type="button"
                        key={r.id}
                        aria-pressed={r.id === selected}
                        onPointerEnter={(e) => {
                          if (e.pointerType !== 'touch') setHovered(r.id);
                        }}
                        onPointerLeave={() => setHovered(null)}
                        onFocus={() => setHovered(r.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() => {
                          setSelected(toggleRegion(selected, r.id));
                          setHovered(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setSelected(null);
                            setHovered(null);
                          }
                        }}
                      >
                        <span>{r.name}</span>
                        <span className="region-indicator" aria-hidden="true">
                          {r.id === selected ? '−' : '+'}
                        </span>
                      </button>
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
      </section>
      <section key={selected || 'empty'} className="guide-panel" aria-label={t('guide')}>
        {region ? (
          <>
            <Button
              className="mobile-back"
              variant="outline"
              onClick={() => {
                setSelected(null);
                setHovered(null);
              }}
            >
              <ArrowLeft className="back-icon" aria-hidden="true" />
              {t('backRegions')}
            </Button>
            <MovementGuide region={region} />
          </>
        ) : (
          <div className="guide-empty">
            <span className="empty-icon" aria-hidden="true">
              ↗
            </span>
            <h2>{t('guide')}</h2>
            <p>{t('choose')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
