import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { products } from '@/db/schema';
import { isAdmin } from '@/lib/admin-auth';

const unauthorized = () => Response.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
const textValue = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;

export async function GET(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  return Response.json(await getDb().select().from(products).orderBy(asc(products.id)));
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  const input = await request.json() as Record<string, unknown>;
  const name = textValue(input.name).trim();
  if (!name) return Response.json({ error: 'กรุณากรอกชื่อสินค้า' }, { status: 400 });
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product'}-${Date.now()}`;
  const [created] = await getDb().insert(products).values({
    name,
    slug,
    description: textValue(input.description),
    grade: textValue(input.grade, 'HG'),
    scale: textValue(input.scale, '1/144'),
    price: Math.max(0, Number(input.price) || 0),
    stock: Math.max(0, Math.floor(Number(input.stock) || 0)),
    featured: Boolean(input.featured),
    active: input.active !== false,
    imageUrl: '/mecha-hero.png',
    imagePosition: '62% center',
  }).returning();
  return Response.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  const input = await request.json() as Record<string, unknown>;
  const id = Number(input.id);
  if (!id) return Response.json({ error: 'ไม่พบสินค้า' }, { status: 400 });
  const [updated] = await getDb().update(products).set({
    name: textValue(input.name).trim(),
    grade: textValue(input.grade, 'HG'),
    scale: textValue(input.scale, '1/144'),
    price: Math.max(0, Number(input.price) || 0),
    stock: Math.max(0, Math.floor(Number(input.stock) || 0)),
    featured: Boolean(input.featured),
    active: Boolean(input.active),
    updatedAt: new Date(),
  }).where(eq(products.id, id)).returning();
  return Response.json(updated);
}

export async function DELETE(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!id) return Response.json({ error: 'ไม่พบสินค้า' }, { status: 400 });
  await getDb().delete(products).where(eq(products.id, id));
  return Response.json({ ok: true });
}
