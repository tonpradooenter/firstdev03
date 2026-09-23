import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { products } from '@/db/schema';

export async function GET() {
  try {
    const rows = await getDb().select().from(products).where(eq(products.active, true)).orderBy(asc(products.id));
    return Response.json(rows.map((product) => ({
      id: product.id,
      name: product.name,
      grade: `${product.grade} ${product.scale}`,
      price: product.price,
      stock: product.stock,
      tag: product.featured ? 'แนะนำ' : undefined,
      position: product.imagePosition,
    })));
  } catch {
    return Response.json([
      { id: 1, name: 'Astra Frame Zero', grade: 'MG 1/100', price: 1890, stock: 8, tag: 'ขายดี', position: '62% center' },
      { id: 2, name: 'Night Raven Unit', grade: 'RG 1/144', price: 1290, stock: 12, tag: 'มาใหม่', position: '80% center' },
      { id: 3, name: 'Vanguard Type-R', grade: 'HG 1/144', price: 790, stock: 20, position: '45% center' },
      { id: 4, name: 'Iron Warden Custom', grade: 'MGSD', price: 1590, stock: 5, position: '94% center' },
    ]);
  }
}
