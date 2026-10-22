// Wspólne funkcje uwierzytelniania dla Cloudflare Pages Functions.

const encoder = new TextEncoder();
export const COOKIE_NAME = 'zintencja_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dni

// HMAC-SHA256 jako hex
export async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Poprawny token sesji dla danej sekrety
export async function sessionToken(env) {
  return sign('admin', env.SESSION_SECRET);
}

// Cookie sesji (HttpOnly, Secure, SameSite)
export function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// Wyciąga token sesji z nagłówka Cookie
export function getToken(request) {
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([a-f0-9]+)`));
  return match ? match[1] : null;
}

// Porównanie odporne na atak czasowy
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
