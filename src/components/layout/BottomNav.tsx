import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Flame, House, Menu, NotebookPen } from 'lucide-react';
import { cx } from '../../lib/cx';

const items = [
  { to: '/', key: 'today', Icon: House, end: true },
  { to: '/cravings', key: 'cravings', Icon: Flame, end: false },
  { to: '/program', key: 'program', Icon: BookOpen, end: false },
  { to: '/journal', key: 'journal', Icon: NotebookPen, end: false },
  { to: '/more', key: 'more', Icon: Menu, end: false },
] as const;

export function BottomNav() {
  const { t } = useTranslation('nav');
  return (
    <nav
      className="safe-bottom sticky bottom-0 z-40 border-t border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"
      aria-label={t('mainNav')}
    >
      <div className="mx-auto grid w-full max-w-2xl grid-cols-5 px-1">
        {items.map(({ to, key, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx(
                'flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                isActive
                  ? 'text-teal-700 dark:text-teal-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} aria-hidden className={isActive ? 'stroke-[2.5px]' : undefined} />
                {t(key)}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
