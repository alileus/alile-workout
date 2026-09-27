import chest from '../../../content/book/en/chest.json';
import back from '../../../content/book/en/back.json';
import shoulders from '../../../content/book/en/shoulders.json';
import arms from '../../../content/book/en/arms.json';
import core from '../../../content/book/en/core.json';
import legs from '../../../content/book/en/legs.json';
import ar from '../../../content/book/ar/regions.json';
import ja from '../../../content/book/ja/regions.json';
import { groupSchema, regionSchema, type Region } from './schema';
import type { Locale } from '@/i18n/routing';
export const englishBook = [chest, back, shoulders, arms, core, legs].map((group) =>
  groupSchema.parse(group),
);
const overlays: Record<string, Record<string, unknown>> = { ar, ja };
export function hasTranslation(locale: Locale, id: string) {
  return locale === 'en' || !!overlays[locale]?.[id];
}
export function getBook(locale: Locale) {
  return englishBook.map((group) => ({
    ...group,
    sections: group.sections.map((section) => ({
      ...section,
      regions: section.regions.map((region) =>
        overlays[locale]?.[region.id] ? regionSchema.parse(overlays[locale][region.id]) : region,
      ),
    })),
  }));
}
export function getRegion(
  locale: Locale,
  id: string,
): { group: string; region: Region } | undefined {
  for (const group of getBook(locale))
    for (const section of group.sections) {
      const region = section.regions.find((region) => region.id === id);
      if (region) return { group: group.id, region };
    }
}
export function suggestionUrl(id?: string) {
  const params = new URLSearchParams({
    template: 'book-update.yml',
    title: id ? `[Book] ${id}` : '[Book] Suggest an update',
    entry: id || '',
  });
  return `https://github.com/alileus/alile-workout/issues/new?${params}`;
}
