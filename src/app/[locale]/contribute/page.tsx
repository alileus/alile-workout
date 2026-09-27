import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { DocumentShell } from '@/components/document-shell';
import { Link } from '@/i18n/navigation';
import { suggestionUrl } from '@/features/workout-book/data';
import { pageMetadata } from '@/lib/seo';
const copy = {
  en: {
    intro: 'You don’t need to code to improve the workout book.',
    steps: [
      ['Find an entry', 'Open a muscle guide and choose “Suggest an edit”.'],
      [
        'Tell us what should change',
        'Suggest a correction, add a movement, or provide a translation. Include a reliable reference for anatomy and exercise claims.',
      ],
      [
        'Review together',
        'A maintainer reviews your suggestion and turns accepted changes into a pull request. Follow the discussion on GitHub.',
      ],
    ],
    action: 'Suggest a book update',
    github: 'A free GitHub account is needed to submit a suggestion.',
    code: 'For developers',
    review:
      'The current book is a community draft awaiting expert review. Illustrations show approximate locations, including deep-layer cutaways.',
  },
  ar: {
    intro: 'لا تحتاج إلى البرمجة لتحسين دليل التمارين.',
    steps: [
      ['اختر محتوى', 'افتح دليل عضلة واختر «اقترح تعديلًا».'],
      [
        'اشرح التغيير',
        'اقترح تصحيحًا أو تمرينًا أو ترجمة. أرفق مرجعًا موثوقًا للمعلومات التشريحية والتمارين.',
      ],
      [
        'راجع معنا',
        'يراجع المشرف اقتراحك ويحول التعديلات المقبولة إلى طلب دمج. يمكنك متابعة النقاش على GitHub.',
      ],
    ],
    action: 'اقترح تحديثًا للدليل',
    github: 'يلزم حساب GitHub مجاني لإرسال الاقتراح.',
    code: 'للمطورين',
    review:
      'الدليل مسودة مجتمعية تحتاج إلى مراجعة مختصين. الرسوم توضح مواقع تقريبية للعضلات، بما فيها الطبقات العميقة.',
  },
  ja: {
    intro: 'コードを書かなくても、ワークアウトブックの改善に参加できます。',
    steps: [
      ['記事を選ぶ', '筋肉のガイドを開き、「修正を提案」を選びます。'],
      [
        '変更内容を伝える',
        '訂正、種目の追加、翻訳を提案してください。解剖学や運動に関する情報には信頼できる資料を添えてください。',
      ],
      [
        '一緒に確認する',
        'メンテナーが提案を確認し、採用した変更をプルリクエストにまとめます。GitHubで議論を追えます。',
      ],
    ],
    action: '記事の更新を提案',
    github: '提案の送信には無料のGitHubアカウントが必要です。',
    code: '開発者向け',
    review:
      '現在の内容は専門家による確認が必要な草稿です。図は深層筋を含め、おおよその位置を示しています。',
  },
};
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'App' });
  return pageMetadata(locale, '/contribute', t('contribute'), copy[locale].intro);
}
export default async function Contribute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const c = copy[locale],
    t = await getTranslations('App');
  return (
    <DocumentShell>
      <h1>{t('contribute')}</h1>
      <p>{c.intro}</p>
      <div className="contribution-steps">
        {c.steps.map(([title, body], i) => (
          <section key={title}>
            <h2>
              {String(i + 1).padStart(2, '0')} · {title}
            </h2>
            <p>{body}</p>
          </section>
        ))}
        <a href={suggestionUrl()}>{c.action} ↗</a>
        <p>{c.github}</p>
        <h2>{c.code}</h2>
        <a href="https://github.com/alileus/alile-workout/blob/main/CONTRIBUTING.md">
          CONTRIBUTING.md ↗
        </a>
        <Link href="/design-system">{t('design')} ↗</Link>
        <p>{c.review}</p>
      </div>
    </DocumentShell>
  );
}
