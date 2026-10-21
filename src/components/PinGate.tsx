import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Delete, LifeBuoy, Lock } from 'lucide-react';
import { SETTING_KEYS, getSetting, setSetting } from '../data/db';
import { verifyPin } from '../lib/pin';
import { isSessionUnlocked, touchSession, unlockSessionForThisTab } from '../lib/session';
import { Splash } from './Splash';

const MAX_FREE_FAILS = 5;
const LOCKOUT_MS = 30_000;

export function PinGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation(['settings', 'common', 'nav']);
  // undefined = aún comprobando; false = no activo; true = activo. Fail-closed:
  // mientras no confirmemos que el bloqueo está desactivado, no mostramos datos.
  const enabled = useLiveQuery(
    async () =>
      (await getSetting<boolean>(SETTING_KEYS.lockEnabled, false)) &&
      !!(await getSetting<string>(SETTING_KEYS.pinHash, '')),
    [],
    undefined,
  );
  const pinHash = useLiveQuery(() => getSetting<string>(SETTING_KEYS.pinHash, ''), [], undefined);
  const pinSalt = useLiveQuery(() => getSetting<string>(SETTING_KEYS.pinSalt, ''), [], undefined);

  const [session, setSession] = useState(() => isSessionUnlocked());
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [checking, setChecking] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);

  // Auto-lock por inactividad: comprobamos cada 30 s.
  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => {
      if (!isSessionUnlocked()) setSession(false);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [session]);

  // Cuenta atrás del bloqueo por intentos fallidos.
  useEffect(() => {
    if (lockRemaining <= 0) return;
    const id = window.setInterval(() => setLockRemaining((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [lockRemaining]);

  // Mover foco al pad cuando aparece el gate.
  useEffect(() => {
    if (enabled && !session) padRef.current?.querySelector('button')?.focus();
  }, [enabled, session]);

  if (enabled === undefined || pinHash === undefined || pinSalt === undefined) return <Splash />;
  if (!enabled || !pinHash || !pinSalt || session) {
    // Aunque el gate no esté activo, mantenemos la sesión "tocada" para que
    // el auto-lock no dispare tras volver de /help u otra ruta pública.
    return children;
  }

  async function tryUnlock(candidate: string) {
    if (lockRemaining > 0 || checking) return;
    setChecking(true);
    try {
      const ok = await verifyPin(candidate, pinSalt!, pinHash!);
      if (ok) {
        unlockSessionForThisTab();
        setSession(true);
        setError(false);
        await setSetting(SETTING_KEYS.pinFailCount, 0);
        await setSetting(SETTING_KEYS.pinLockUntil, 0);
      } else {
        setError(true);
        setEntry('');
        const fails = (await getSetting<number>(SETTING_KEYS.pinFailCount, 0)) + 1;
        await setSetting(SETTING_KEYS.pinFailCount, fails);
        if (fails >= MAX_FREE_FAILS) {
          const lockUntil = Date.now() + LOCKOUT_MS;
          await setSetting(SETTING_KEYS.pinLockUntil, lockUntil);
          await setSetting(SETTING_KEYS.pinFailCount, 0);
          setLockRemaining(Math.ceil(LOCKOUT_MS / 1000));
        }
      }
    } finally {
      setChecking(false);
    }
  }

  function press(digit: string) {
    touchSession();
    setError(false);
    const next = (entry + digit).slice(0, 4);
    setEntry(next);
    if (next.length === 4) void tryUnlock(next);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-slate-50 p-6 dark:bg-slate-950"
      role="dialog"
      aria-modal="true"
      aria-label={t('settings:lockTitle')}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Lock size={28} aria-hidden className="text-teal-600" />
        <h1 className="page-title">{t('settings:lockTitle')}</h1>
        {lockRemaining > 0 ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t('settings:pinLocked', { seconds: lockRemaining })}
          </p>
        ) : error ? (
          <p className="text-sm text-rose-600" role="alert">
            {t('settings:pinWrong')}
          </p>
        ) : null}
      </div>
      <div className="flex gap-3" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full ring-1 ring-slate-300 dark:ring-slate-700"
            style={entry.length > i ? { background: 'var(--color-teal-600)' } : undefined}
          />
        ))}
      </div>
      <div ref={padRef} className="grid w-56 grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'ok'].map((key) =>
          key === 'back' ? (
            <button
              key={key}
              type="button"
              className="btn-secondary !min-h-12"
              onClick={() => {
                touchSession();
                setError(false);
                setEntry((v) => v.slice(0, -1));
              }}
              aria-label="⌫"
            >
              <Delete size={18} aria-hidden />
            </button>
          ) : key === 'ok' ? (
            <button
              key={key}
              type="button"
              className="btn-primary !min-h-12"
              disabled={lockRemaining > 0 || checking}
              onClick={() => void tryUnlock(entry)}
            >
              {t('common:actions.continue')}
            </button>
          ) : (
            <button
              key={key}
              type="button"
              className="btn-secondary !min-h-12"
              disabled={lockRemaining > 0}
              onClick={() => press(key)}
            >
              {key}
            </button>
          ),
        )}
      </div>
      {/* SOS siempre disponible, incluso con la app bloqueada. */}
      <a href="/help" className="btn-secondary !min-h-11 text-rose-700 dark:text-rose-300">
        <LifeBuoy size={16} aria-hidden />
        {t('nav:help')}
      </a>
    </div>
  );
}
