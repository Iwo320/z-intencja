import { clearCookie } from '../_utils.js';

// POST /api/logout
export async function onRequestPost() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookie() } });
}
