import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import type { Source } from '../content/sources';

export function SourcesList({ sources }: { sources: readonly Source[] }) {
  const { t } = useTranslation('program');
  if (sources.length === 0) return null;
  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {t('sources')}
      </p>
      <ul className="space-y-1">
        {sources.map((s) => (
          <li key={s.url} className="text-xs">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
            >
              {s.org} — {s.title}
              <ExternalLink size={11} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
