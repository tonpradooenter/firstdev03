import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { products } from '@/db/schema';

export async function GET() {
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
}
