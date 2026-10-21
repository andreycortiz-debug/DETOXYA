import { Link } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation('nav');
  return (
    <header className="safe-top sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight"
          aria-label={t('appName')}
        >
          <img src="/icon.svg" alt="" width={28} height={28} className="rounded-lg" />
          <span className="text-slate-900 dark:text-white">DETOXYA</span>
        </Link>
        <Link
          to="/help"
          className="btn-danger !min-h-9 !rounded-full !px-3 !py-1 text-xs"
          aria-label={t('help')}
        >
          <LifeBuoy size={16} aria-hidden />
          <span className="hidden sm:inline">SOS</span>
        </Link>
      </div>
    </header>
  );
}
