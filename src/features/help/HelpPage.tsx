import { useTranslation } from 'react-i18next';
import { ExternalLink, Phone, ShieldAlert } from 'lucide-react';
import { Button, Card, PageHeader } from '../../components/ui';
import { useProfile } from '../profile/useProfile';
import { useCrisisStore } from '../../store/crisis';
import { emergencyPhoneFor, getHelpResources } from './resources';

export function HelpPage() {
  const { t } = useTranslation(['help', 'resources', 'common']);
  const profile = useProfile();
  const openCrisis = useCrisisStore((s) => s.open);
  const country = profile?.country ?? null;
  const emergency = emergencyPhoneFor(country);
  const resources = getHelpResources(country);

  return (
    <>
      <PageHeader title={t('help:title')} subtitle={t('help:intro')} />

      <div className="mb-4 flex flex-col gap-2">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => openCrisis('active', 'help-page')}
        >
          <ShieldAlert size={18} aria-hidden />
          {t('help:inCrisisCta')}
        </Button>
        {emergency && (
          <a href={`tel:${emergency}`} className="btn-danger w-full">
            <Phone size={18} aria-hidden />
            {t('help:callEmergency', { number: emergency })}
          </a>
        )}
      </div>

      <section className="mb-6 space-y-3">
        <h2 className="text-base font-semibold">{t('help:linesTitle')}</h2>
        {resources.map((r) => (
          <Card key={r.id} className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{r.name}</p>
            <p className="muted text-xs">{t(r.noteKey, { ns: 'resources' })}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {r.telHref && (
                <a href={r.telHref} className="btn-secondary !min-h-9 !px-3 !py-1.5 text-xs">
                  <Phone size={14} aria-hidden />
                  {r.phone}
                </a>
              )}
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ghost !min-h-9 !px-3 !py-1.5 text-xs"
                >
                  <ExternalLink size={14} aria-hidden />
                  {t('common:actions.seeAll')}
                </a>
              )}
            </div>
          </Card>
        ))}
      </section>

      <section className="mb-6 space-y-3">
        <h2 className="text-base font-semibold">{t('help:harmTitle')}</h2>
        <Card className="space-y-2">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>{t('help:harm1')}</li>
            <li>{t('help:harm2')}</li>
            <li>{t('help:harm3')}</li>
            <li>{t('help:harm4')}</li>
            <li>{t('help:harm5')}</li>
          </ul>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">{t('help:notAloneTitle')}</h2>
        <p className="muted">{t('help:notAloneBody')}</p>
        <div className="banner-warning">{t('help:medicalNote')}</div>
      </section>
    </>
  );
}
