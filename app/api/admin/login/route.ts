import { adminCookieName, createAdminToken } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const { password } = await request.json() as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.AUTH_SECRET) return Response.json({ error: 'ยังไม่ได้ตั้งค่าระบบแอดมินบนเซิร์ฟเวอร์' }, { status: 503 });
  if (!password || password !== expected) return Response.json({ error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  const token = await createAdminToken();
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': `${adminCookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800` } });
}
