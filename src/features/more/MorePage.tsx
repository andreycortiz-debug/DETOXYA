import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bot, ChartLine, HelpCircle, ListChecks, Map, Settings, ChevronRight } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui';

const ITEMS = [
  { to: '/coach', icon: Bot, ns: 'coach', key: 'title' },
  { to: '/dashboard', icon: ChartLine, ns: 'nav', key: 'dashboard' },
  { to: '/paths', icon: Map, ns: 'nav', key: 'paths' },
  { to: '/triggers', icon: ListChecks, ns: 'cravings', key: 'triggersCtaShort' },
  { to: '/help', icon: HelpCircle, ns: 'nav', key: 'help' },
  { to: '/settings', icon: Settings, ns: 'nav', key: 'settings' },
] as const;

export function MorePage() {
  const { t } = useTranslation(['nav', 'coach', 'cravings', 'settings', 'common']);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title={t('nav:more')} />
      <Card className="divide-y divide-slate-100 !p-0 dark:divide-slate-800">
        {ITEMS.map(({ to, icon: Icon, ns, key }) => (
          <button
            key={to}
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-slate-800 active:bg-slate-50 dark:text-slate-100 dark:active:bg-slate-800"
            onClick={() => navigate(to)}
          >
            <Icon size={18} aria-hidden className="shrink-0 text-teal-600 dark:text-teal-400" />
            <span className="flex-1">{t(`${ns}:${key}`)}</span>
            <ChevronRight size={16} aria-hidden className="text-slate-400" />
          </button>
        ))}
      </Card>
      <p className="muted mt-4 text-center text-xs">DETOXYA · AGPL-3.0 · {t('settings:privacy')}</p>
    </>
  );
}
