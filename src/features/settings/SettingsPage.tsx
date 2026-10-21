import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Download, Lock, Upload, Wifi, Zap } from 'lucide-react';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { SETTING_KEYS, getSetting, setSetting } from '../../data/db';
import { clearAllData, exportAll, importAll, validateImport } from '../../data/transfer';
import { DEFAULT_OLLAMA_MODEL, DEFAULT_OLLAMA_URL, testOllamaConnection } from '../../llm/coach';
import { storePin, verifyPin } from '../../lib/pin';
import { applyTheme, getThemePref, type ThemePref } from '../../lib/theme';
import { useProfile } from '../profile/useProfile';

export function SettingsPage() {
  const { t, i18n } = useTranslation(['settings', 'nav', 'common']);
  const profile = useProfile();
  const [aiEnabled, setAiEnabledState] = useState<boolean | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [testState, setTestState] = useState<{
    status: 'idle' | 'testing' | 'ok' | 'fail';
    msg: string;
  }>({
    status: 'idle',
    msg: '',
  });
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [themePref, setThemePref] = useState<ThemePref>(() => getThemePref());
  const [pinDraft, setPinDraft] = useState('');
  const [currentPinDraft, setCurrentPinDraft] = useState('');
  const [pinSavedFlash, setPinSavedFlash] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const storedEnabled = useLiveQuery(
    () => getSetting<boolean>(SETTING_KEYS.aiEnabled, false),
    [],
    false,
  );
  const storedUrl = useLiveQuery(
    () => getSetting<string>(SETTING_KEYS.aiBaseUrl, DEFAULT_OLLAMA_URL),
    [],
    DEFAULT_OLLAMA_URL,
  );
  const storedModel = useLiveQuery(
    () => getSetting<string>(SETTING_KEYS.aiModel, DEFAULT_OLLAMA_MODEL),
    [],
    DEFAULT_OLLAMA_MODEL,
  );
  const lockEnabled = useLiveQuery(
    () => getSetting<boolean>(SETTING_KEYS.lockEnabled, false),
    [],
    false,
  );
  const pinHash = useLiveQuery(() => getSetting<string>(SETTING_KEYS.pinHash, ''), [], '');
  const pinSalt = useLiveQuery(() => getSetting<string>(SETTING_KEYS.pinSalt, ''), [], '');
  const hasPin = !!pinHash && !!pinSalt;

  const enabled = aiEnabled ?? storedEnabled;
  const url = baseUrl ?? storedUrl;
  const mdl = model ?? storedModel;

  async function setEnabled(value: boolean) {
    setAiEnabledState(value);
    await setSetting(SETTING_KEYS.aiEnabled, value);
  }

  async function runTest() {
    setTestState({ status: 'testing', msg: '' });
    try {
      await testOllamaConnection(url, mdl);
      setTestState({ status: 'ok', msg: t('settings:aiOk', { model: mdl }) });
    } catch (e) {
      setTestState({ status: 'fail', msg: t('settings:aiFail', { error: String(e) }) });
    }
  }

  async function onExport() {
    const payload = await exportAll();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `detoxya-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onImport(file: File) {
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const error = validateImport(parsed);
      if (error) {
        setImportMsg(t('settings:importBad'));
        return;
      }
      const count = await importAll(parsed as Parameters<typeof importAll>[0]);
      setImportMsg(t('settings:importOk', { count }));
      window.setTimeout(() => window.location.reload(), 900);
    } catch {
      setImportMsg(t('settings:importBad'));
    }
  }

  async function onClearAll() {
    if (!window.confirm(t('settings:clearAllConfirm'))) return;
    await clearAllData();
    window.location.reload();
  }

  async function savePin() {
    const pin = pinDraft.trim();
    setPinError(null);
    if (!/^\d{4}$/.test(pin)) return;
    // Si ya hay un PIN, exigir el actual antes de cambiarlo.
    if (hasPin) {
      const ok = await verifyPin(currentPinDraft.trim(), pinSalt, pinHash);
      if (!ok) {
        setPinError(t('settings:pinWrong'));
        return;
      }
    }
    const { salt, hash } = await storePin(pin);
    await setSetting(SETTING_KEYS.pinSalt, salt);
    await setSetting(SETTING_KEYS.pinHash, hash);
    await setSetting(SETTING_KEYS.lockEnabled, true);
    await setSetting(SETTING_KEYS.pinFailCount, 0);
    await setSetting(SETTING_KEYS.pinLockUntil, 0);
    setPinDraft('');
    setCurrentPinDraft('');
    setPinSavedFlash(true);
    window.setTimeout(() => setPinSavedFlash(false), 2000);
  }

  return (
    <>
      <PageHeader title={t('nav:settings')} subtitle={t('settings:subtitle')} />

      <div className="space-y-4">
        <Card className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('settings:appearance')}
          </h2>
          <Field label={t('settings:language')} hint={t('settings:languageHint')}>
            <div className="flex gap-2">
              {(
                [
                  ['es', 'Español'],
                  ['en', 'English'],
                ] as const
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  className={`btn-base flex-1 ${i18n.language === code ? 'bg-teal-600 text-white' : 'btn-secondary'}`}
                  onClick={() => void i18n.changeLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t('settings:theme')}>
            <div className="flex gap-2">
              {(['system', 'light', 'dark'] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  className={`btn-base flex-1 ${themePref === pref ? 'bg-teal-600 text-white' : 'btn-secondary'}`}
                  onClick={() => {
                    setThemePref(pref);
                    applyTheme(pref);
                  }}
                >
                  {t(`settings:theme_${pref}`)}
                </button>
              ))}
            </div>
          </Field>
        </Card>

        <Card className="space-y-3">
          <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Zap size={14} aria-hidden />
            {t('settings:aiTitle')}
          </h2>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-teal-600"
              checked={enabled}
              onChange={(e) => void setEnabled(e.target.checked)}
            />
            <span>
              <span className="font-medium">{t('settings:aiEnable')}</span>
              <span className="muted mt-0.5 block">{t('settings:aiEnableHint')}</span>
            </span>
          </label>
          <Field
            label={t('settings:aiBaseUrl')}
            htmlFor="ai-url"
            hint={t('settings:aiDataWarning')}
          >
            <input
              id="ai-url"
              className="input"
              value={url}
              onChange={(e) => setBaseUrl(e.target.value)}
              onBlur={() => {
                try {
                  const u = new URL(url);
                  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('proto');
                  void setSetting(SETTING_KEYS.aiBaseUrl, url);
                  setTestState({ status: 'idle', msg: '' });
                } catch {
                  setTestState({ status: 'fail', msg: t('settings:aiUrlInvalid') });
                }
              }}
              spellCheck={false}
            />
          </Field>
          <Field label={t('settings:aiModel')} htmlFor="ai-model">
            <input
              id="ai-model"
              className="input"
              value={mdl}
              onChange={(e) => setModel(e.target.value)}
              onBlur={() => void setSetting(SETTING_KEYS.aiModel, mdl)}
              spellCheck={false}
            />
          </Field>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => void runTest()}
              disabled={testState.status === 'testing'}
            >
              <Wifi size={16} aria-hidden />
              {testState.status === 'testing' ? t('settings:aiTesting') : t('settings:aiTest')}
            </Button>
            {testState.msg && (
              <p
                className={`text-xs ${testState.status === 'ok' ? 'text-teal-700 dark:text-teal-300' : 'text-rose-600 dark:text-rose-400'}`}
              >
                {testState.msg}
              </p>
            )}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Lock size={14} aria-hidden />
            {t('settings:lockSection')}
          </h2>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-teal-600"
              checked={lockEnabled}
              disabled={!hasPin}
              onChange={(e) => void setSetting(SETTING_KEYS.lockEnabled, e.target.checked)}
            />
            <span>
              <span className="font-medium">{t('settings:lockEnable')}</span>
              <span className="muted mt-0.5 block">{t('settings:lockHint')}</span>
            </span>
          </label>
          {hasPin && (
            <Field label={t('settings:currentPin')} htmlFor="current-pin">
              <input
                id="current-pin"
                className="input"
                inputMode="numeric"
                maxLength={4}
                value={currentPinDraft}
                onChange={(e) => setCurrentPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
              />
            </Field>
          )}
          <Field label={t('settings:pinLabel')} htmlFor="pin-input">
            <div className="flex gap-2">
              <input
                id="pin-input"
                className="input flex-1"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
              />
              <Button
                onClick={() => void savePin()}
                disabled={pinDraft.length !== 4 || (hasPin && currentPinDraft.length !== 4)}
              >
                {pinSavedFlash ? t('settings:pinSaved') : t('settings:pinSave')}
              </Button>
            </div>
          </Field>
          {pinError && (
            <p className="text-sm text-rose-600" role="alert">
              {pinError}
            </p>
          )}
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('settings:dataTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => void onExport()}>
              <Download size={16} aria-hidden />
              {t('settings:export')}
            </Button>
            <label className="btn-secondary cursor-pointer text-center">
              <Upload size={16} aria-hidden className="mx-auto" />
              {t('settings:import')}
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onImport(file);
                }}
              />
            </label>
          </div>
          {importMsg && <p className="text-xs text-teal-700 dark:text-teal-300">{importMsg}</p>}
          <Button variant="danger" className="w-full" onClick={() => void onClearAll()}>
            {t('settings:clearAll')}
          </Button>
        </Card>

        <Card className="space-y-1.5 text-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('settings:aboutTitle')}
          </h2>
          <p className="muted">
            {t('settings:version')}: {__APP_VERSION__}
          </p>
          <p className="muted">{t('settings:license')}</p>
          <p className="muted">{t('settings:licenseValue')}</p>
          <p className="muted">{t('settings:privacy')}</p>
          <p className="muted">{t('settings:disclaimer')}</p>
          {profile?.country ? (
            <p className="muted">{t('settings:aboutCountry', { country: profile.country })}</p>
          ) : null}
        </Card>
      </div>
    </>
  );
}
