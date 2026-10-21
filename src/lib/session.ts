let unlocked = false;
let lastActivity = Date.now();
const ACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

export function isSessionUnlocked(): boolean {
  if (!unlocked) return false;
  if (Date.now() - lastActivity > ACTIVITY_TIMEOUT_MS) {
    unlocked = false;
    return false;
  }
  return true;
}

export function unlockSessionForThisTab(): void {
  unlocked = true;
  lastActivity = Date.now();
}

export function touchSession(): void {
  if (unlocked) lastActivity = Date.now();
}

export function lockSession(): void {
  unlocked = false;
}
