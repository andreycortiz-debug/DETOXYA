import { useTranslation } from 'react-i18next';

export function Splash() {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <img src="/icon.svg" alt="" width={56} height={56} className="rounded-2xl" />
      <p className="muted">{t('loading')}</p>
    </div>
  );
}
