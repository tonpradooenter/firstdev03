import { adminCookieName } from '@/lib/admin-auth';

export async function POST() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': `${adminCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } });
}
