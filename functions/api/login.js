import { sessionToken, sessionCookie, safeEqual } from '../_utils.js';

// POST /api/login  { "password": "..." }
export async function onRequestPost({ request, env }) {
  let password = '';
  try {
    ({ password } = await request.json());
  } catch {
    return Response.json({ ok: false, error: 'Nieprawidłowe żądanie.' }, { status: 400 });
  }

  // Brak skonfigurowanego hasła = logowanie wyłączone
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return Response.json(
      { ok: false, error: 'Logowanie nie jest skonfigurowane.' },
      { status: 503 }
    );
  }

  if (!safeEqual(password, env.ADMIN_PASSWORD)) {
    // krótkie opóźnienie, żeby utrudnić zgadywanie
    await new Promise((r) => setTimeout(r, 500));
    return Response.json({ ok: false, error: 'Nieprawidłowe hasło.' }, { status: 401 });
  }

  const token = await sessionToken(env);
  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': sessionCookie(token) } }
  );
}
