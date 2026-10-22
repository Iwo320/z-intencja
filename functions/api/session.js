import { getToken, sessionToken, safeEqual } from '../_utils.js';

// GET /api/session → { "auth": true|false }
export async function onRequestGet({ request, env }) {
  const token = getToken(request);
  const valid =
    token && env.SESSION_SECRET && safeEqual(token, await sessionToken(env));
  return Response.json({ auth: Boolean(valid) });
}
