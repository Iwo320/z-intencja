import { getToken, sessionToken, safeEqual } from '../_utils.js';

// Chroni /admin/* — bezpoprawnej sesji przekierowuje na stronę logowania.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // sama strona logowania przechodzi dalej
  if (url.pathname === '/admin/login') return context.next();

  const token = getToken(request);
  const valid =
    token && env.SESSION_SECRET && safeEqual(token, await sessionToken(env));

  if (!valid) {
    return Response.redirect(new URL('/admin/login', url.origin), 302);
  }
  return context.next();
}
