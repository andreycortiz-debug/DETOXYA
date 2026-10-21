import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui';
import { PATHS } from '../../content/paths';
import { SourcesList } from '../../components/SourcesList';

export function PathsPage() {
  const { t, i18n } = useTranslation(['paths', 'program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';

  return (
    <>
      <PageHeader title={t('nav:paths')} subtitle={t('paths:subtitle')} />
      <div className="space-y-4">
        {PATHS.map((path) => (
          <Card key={path.id} className="space-y-3">
            <div>
              <h2 className="text-base font-bold">{path.name}</h2>
              <p className="muted mt-0.5 text-sm">{path.tagline[lang]}</p>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {path.points[lang].map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <a
              href={path.linkUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-secondary w-full"
            >
              <ExternalLink size={16} aria-hidden />
              {path.linkLabel[lang]}
            </a>
            <SourcesList sources={[path.source]} />
          </Card>
        ))}
        <div className="banner-warning">{t('paths:trademarkNote')}</div>
      </div>
    </>
  );
}
