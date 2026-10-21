export type ThemePref = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'detoxya.theme';

function isThemePref(value: unknown): value is ThemePref {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function getThemePref(): ThemePref {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (isThemePref(raw)) return raw;
  } catch {
    // localStorage puede no estar disponible (modo privado estricto)
  }
  return 'system';
}

export function applyTheme(pref: ThemePref): void {
  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = pref === 'dark' || (pref === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // ignorar
  }
}

export function initTheme(): void {
  applyTheme(getThemePref());
  if (typeof window.matchMedia !== 'function') return;
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', () => {
    if (getThemePref() === 'system') applyTheme('system');
  });
}
