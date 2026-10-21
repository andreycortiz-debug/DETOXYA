const enc = new TextEncoder();

export function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = enc.encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPin(pin: string, salt: string, expectedHash: string): Promise<boolean> {
  if (!salt || !expectedHash) return false;
  const candidate = await hashPin(pin, salt);
  if (candidate.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++)
    diff |= candidate.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  return diff === 0;
}

export async function storePin(pin: string): Promise<{ salt: string; hash: string }> {
  const salt = randomSalt();
  const hash = await hashPin(pin, salt);
  return { salt, hash };
}
