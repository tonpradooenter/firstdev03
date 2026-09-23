const COOKIE_NAME = 'mecha_admin';

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sign(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not configured');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

export async function createAdminToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  return `${expires}.${await sign(String(expires))}`;
}

export async function isAdmin(request: Request) {
  const cookie = request.headers.get('cookie')?.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!cookie) return false;
  const [expires, signature] = cookie.split('.');
  return Number(expires) > Date.now() && signature === await sign(expires);
}

export const adminCookieName = COOKIE_NAME;
