'use client';

import { type SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, LogOut, PackagePlus, RefreshCw, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Product = { id: number; name: string; grade: string; scale: string; price: number; stock: number; featured: boolean; active: boolean };

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    const response = await fetch('/api/admin/products');
    if (response.status === 401) return setAuthorized(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'โหลดข้อมูลสินค้าไม่สำเร็จ' })) as { error?: string };
      setAuthorized(true);
      return setMessage(data.error ?? 'โหลดข้อมูลสินค้าไม่สำเร็จ');
    }
    setProducts(await response.json());
    setAuthorized(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  async function login(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: form.get('password') }) });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'เข้าสู่ระบบไม่สำเร็จ' })) as { error?: string };
      return setMessage(data.error ?? 'เข้าสู่ระบบไม่สำเร็จ');
    }
    setMessage('');
    await loadProducts();
  }

  async function addProduct(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
    if (!response.ok) return setMessage('เพิ่มสินค้าไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
    setOpen(false);
    setMessage('เพิ่มสินค้าเรียบร้อยแล้ว');
    await loadProducts();
  }

  async function toggleProduct(product: Product) {
    await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...product, active: !product.active }) });
    await loadProducts();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthorized(false);
    setProducts([]);
  }

  if (authorized === null) return <main className="grid min-h-screen place-items-center bg-[#08090b] text-zinc-500"><RefreshCw className="size-7 animate-spin" /></main>;

  if (!authorized) return (
    <main className="grid min-h-screen place-items-center bg-[#08090b] px-5 text-white">
      <form onSubmit={login} className="w-full max-w-sm border border-white/10 bg-[#111216] p-7 shadow-2xl">
        <div className="mb-7 grid size-12 place-items-center bg-red-600"><ShieldCheck /></div>
        <p className="text-xs font-bold tracking-[.18em] text-red-500">MECHA VAULT</p>
        <h1 className="mt-2 text-2xl font-black">เข้าสู่ระบบหลังบ้าน</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">พื้นที่สำหรับผู้ดูแลร้านค้าเท่านั้น</p>
        <label htmlFor="admin-password" className="mt-7 block text-sm font-medium">รหัสผ่าน</label><Input id="admin-password" name="password" type="password" required className="mt-2 h-11 rounded-none border-white/10 bg-black/30" placeholder="กรอกรหัสผ่านแอดมิน" />
        {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
        <Button type="submit" className="mt-5 h-11 w-full rounded-none bg-red-600 text-white hover:bg-red-500">เข้าสู่ระบบ</Button>
        <Link href="/" className="mt-5 flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft className="size-4"/> กลับหน้าร้าน</Link>
      </form>
    </main>
  );

  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <header className="border-b border-white/10 bg-[#0d0e11]"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8"><div><p className="text-xs font-bold tracking-[.18em] text-red-500">MECHA VAULT</p><h1 className="text-lg font-black">ADMIN CONTROL</h1></div><div className="flex items-center gap-2"><Link href="/" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium hover:bg-white/5"><ArrowLeft className="size-4" /> หน้าร้าน</Link><Button variant="outline" onClick={logout}><LogOut /> ออกจากระบบ</Button></div></div></header>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-zinc-500">ภาพรวมคลังสินค้า</p><h2 className="mt-1 text-3xl font-black">จัดการสินค้า</h2></div>
          <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button className="h-11 rounded-none bg-red-600 px-5 text-white hover:bg-red-500" />}><PackagePlus /> เพิ่มสินค้า</DialogTrigger><DialogContent className="border-white/10 bg-[#121317] text-white sm:max-w-lg"><form onSubmit={addProduct}><DialogHeader><DialogTitle className="text-xl">เพิ่มสินค้าใหม่</DialogTitle><DialogDescription>กรอกข้อมูลสินค้าเพื่อแสดงในหน้าร้าน</DialogDescription></DialogHeader><div className="grid gap-4 py-6"><label htmlFor="product-name" className="text-sm">ชื่อสินค้า</label><Input id="product-name" name="name" required className="h-10" /><div className="grid grid-cols-2 gap-3"><div><label htmlFor="product-grade" className="text-sm">เกรด</label><Input id="product-grade" name="grade" required defaultValue="HG" className="mt-2 h-10" /></div><div><label htmlFor="product-scale" className="text-sm">สเกล</label><Input id="product-scale" name="scale" required defaultValue="1/144" className="mt-2 h-10" /></div></div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="product-price" className="text-sm">ราคา (บาท)</label><Input id="product-price" name="price" required type="number" min="0" className="mt-2 h-10" /></div><div><label htmlFor="product-stock" className="text-sm">จำนวนในสต็อก</label><Input id="product-stock" name="stock" required type="number" min="0" className="mt-2 h-10" /></div></div><label htmlFor="product-description" className="text-sm">รายละเอียด</label><Input id="product-description" name="description" className="h-10" /></div><DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)}>ยกเลิก</Button><Button type="submit" className="bg-red-600 text-white hover:bg-red-500">บันทึกสินค้า</Button></DialogFooter></form></DialogContent></Dialog>
        </div>
        {message && <div className="mb-5 border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">{message}</div>}
        <div className="mb-7 grid gap-4 sm:grid-cols-3"><Stat title="สินค้าทั้งหมด" value={`${products.length} รายการ`} /><Stat title="พร้อมขาย" value={`${products.filter((product) => product.active).length} รายการ`} /><Stat title="มูลค่าสต็อก" value={`฿${inventoryValue.toLocaleString()}`} /></div>
        <div className="border border-white/10 bg-[#0f1013]"><Table><TableHeader><TableRow className="border-white/10 hover:bg-transparent"><TableHead className="pl-5 text-zinc-500">สินค้า</TableHead><TableHead className="text-zinc-500">เกรด</TableHead><TableHead className="text-zinc-500">ราคา</TableHead><TableHead className="text-zinc-500">สต็อก</TableHead><TableHead className="text-zinc-500">สถานะ</TableHead><TableHead className="pr-5 text-right text-zinc-500">เปิดขาย</TableHead></TableRow></TableHeader><TableBody>{products.map((product) => <TableRow key={product.id} className="border-white/8"><TableCell className="pl-5 py-4 font-semibold">{product.name}</TableCell><TableCell><Badge variant="outline" className="rounded-none border-white/10 text-zinc-300">{product.grade} {product.scale}</Badge></TableCell><TableCell>฿{product.price.toLocaleString()}</TableCell><TableCell>{product.stock}</TableCell><TableCell className={product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>{product.stock > 0 ? 'มีสินค้า' : 'หมด'}</TableCell><TableCell className="pr-5 text-right"><Switch checked={product.active} onCheckedChange={() => toggleProduct(product)} aria-label={`เปิดขาย ${product.name}`} /></TableCell></TableRow>)}</TableBody></Table></div>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return <div className="border border-white/10 bg-[#111216] p-5"><div className="mb-4 grid size-9 place-items-center bg-white/5 text-red-500"><Box className="size-5" /></div><p className="text-sm text-zinc-500">{title}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}
