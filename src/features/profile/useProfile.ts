import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import type { Profile, QuitTarget } from '../../data/types';

/**
 * `undefined` = aún cargando; `null` = no existe todavía (sin onboarding).
 * Es importante distinguirlos: un perfil inexistente devuelve `undefined`
 * en Dexie, y el guardia de rutas se colgaría en el splash.
 */
export function useProfile(): Profile | null | undefined {
  return useLiveQuery(async () => (await db.profile.get('current')) ?? null, [], undefined);
}

export function useActiveTargets(): QuitTarget[] | undefined {
  return useLiveQuery(
    async () => (await db.quitTargets.toArray()).filter((t) => t.endDate === null),
    [],
    undefined,
  );
}
