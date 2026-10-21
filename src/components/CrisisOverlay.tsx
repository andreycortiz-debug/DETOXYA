import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ExternalLink, X } from 'lucide-react';
import { useCrisisStore } from '../store/crisis';
import { useProfile } from '../features/profile/useProfile';
import { emergencyPhoneFor, getHelpResources } from '../features/help/resources';
import { Button } from './ui';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CrisisOverlay() {
  const { t } = useTranslation(['safety', 'resources']);
  const { active, level, close } = useCrisisStore();
  const profile = useProfile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<HTMLAnchorElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    // Bloquear scroll del fondo.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    callRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus?.();
    };
  }, [active, close]);

  if (!active) return null;

  const country = profile?.country ?? null;
  const emergency = emergencyPhoneFor(country);
  const lines = getHelpResources(country).filter((r) => r.kind === 'crisis-line');
  const primaryLine = lines[0] ?? null;
  const isUrgent = level === 'urgent-medical';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur sm:items-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
    >
      <div ref={dialogRef} className="card w-full max-w-lg !p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2
            id="crisis-title"
            className={`text-lg font-bold ${isUrgent ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300'}`}
          >
            {isUrgent ? t('safety:crisis.urgentTitle') : t('safety:crisis.title')}
          </h2>
          <button
            type="button"
            onClick={close}
            className="btn-ghost !min-h-11 !px-3"
            aria-label={t('safety:crisis.close')}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
          {isUrgent ? t('safety:crisis.urgentBody') : t('safety:crisis.body')}
        </p>

        <div className="mb-4 flex flex-col gap-2">
          {(emergency || primaryLine) && (
            <a
              ref={callRef}
              href={
                emergency ? `tel:${emergency}` : (primaryLine?.telHref ?? primaryLine?.url ?? '#')
              }
              className="btn-danger w-full"
            >
              <Phone size={18} aria-hidden />
              {emergency
                ? t('safety:crisis.callEmergency', { number: emergency })
                : `${primaryLine?.name ?? ''}`}
            </a>
          )}
          {emergency && primaryLine && primaryLine.telHref && (
            <a href={primaryLine.telHref} className="btn-secondary w-full">
              <Phone size={18} aria-hidden />
              {primaryLine.name}
            </a>
          )}
          <a
            href="https://findahelpline.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-secondary w-full"
          >
            <ExternalLink size={18} aria-hidden />
            {t('safety:crisis.findLine')}
          </a>
        </div>

        <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>{t('safety:crisis.step1')}</li>
          <li>{t('safety:crisis.step2')}</li>
          <li>{t('safety:crisis.step3')}</li>
          <li>{t('safety:crisis.step4')}</li>
        </ol>

        <Button variant="secondary" className="w-full" onClick={close}>
          {t('safety:crisis.dismiss')}
        </Button>
      </div>
    </div>
  );
}
