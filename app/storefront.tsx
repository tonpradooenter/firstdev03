'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type Product = { id: number; name: string; grade: string; price: number; stock: number; tag?: string; position: string };

const demoProducts: Product[] = [
  { id: 1, name: 'Astra Frame Zero', grade: 'MG 1/100', price: 1890, stock: 8, tag: 'ขายดี', position: '62% center' },
  { id: 2, name: 'Night Raven Unit', grade: 'RG 1/144', price: 1290, stock: 12, tag: 'มาใหม่', position: '80% center' },
  { id: 3, name: 'Vanguard Type-R', grade: 'HG 1/144', price: 790, stock: 20, position: '45% center' },
  { id: 4, name: 'Iron Warden Custom', grade: 'MGSD', price: 1590, stock: 5, position: '94% center' },
];
const grades = ['ทั้งหมด', 'HG', 'RG', 'MG', 'PG'];

export function Storefront() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedGrade, setSelectedGrade] = useState('ทั้งหมด');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const visibleProducts = useMemo(() => products.filter((product) => (selectedGrade === 'ทั้งหมด' || product.grade.startsWith(selectedGrade)) && product.name.toLowerCase().includes(query.toLowerCase())), [products, query, selectedGrade]);
  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const updateCart = (id: number, amount: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) }));

  useEffect(() => {
    fetch('/api/products')
      .then(async (response) => {
        if (!response.ok) throw new Error('โหลดสินค้าไม่สำเร็จ');
        return await response.json() as Product[];
      })
      .then((data) => setProducts(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'add_product_to_cart',
      title: 'เพิ่มสินค้าลงตะกร้า',
      description: 'เพิ่มสินค้าในหน้าร้าน MECHA VAULT ลงตะกร้าตามรหัสสินค้าและจำนวนที่ระบุ',
      inputSchema: {
        type: 'object',
        properties: { productId: { type: 'number' }, quantity: { type: 'number', minimum: 1, maximum: 10 } },
        required: ['productId', 'quantity'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const value = input as { productId?: number; quantity?: number };
        const product = products.find((item) => item.id === value.productId);
        if (!product || !Number.isInteger(value.quantity) || Number(value.quantity) < 1 || Number(value.quantity) > 10) throw new Error('ข้อมูลสินค้าและจำนวนไม่ถูกต้อง');
        setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + Number(value.quantity) }));
        return { productId: product.id, productName: product.name, quantityAdded: value.quantity };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [products]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#090a0c]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Mecha Vault หน้าหลัก"><span className="grid size-9 place-items-center border border-red-500/50 bg-red-500/10 text-sm font-black text-red-500">MV</span><span className="text-base font-black tracking-[0.16em]">MECHA VAULT</span></a>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex" aria-label="เมนูหลัก"><a className="text-white" href="#products">สินค้า</a><a className="transition hover:text-white" href="#grades">เกรดโมเดล</a><Link className="transition hover:text-white" href="/admin">สำหรับแอดมิน</Link></nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="เปิดเมนู"><Menu /></Button>
            <Sheet>
              <SheetTrigger render={<Button className="relative h-10 bg-white px-4 text-black hover:bg-zinc-200" />}><ShoppingBag /> ตะกร้า{cartCount > 0 && <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-red-600 text-[11px] font-bold text-white">{cartCount}</span>}</SheetTrigger>
              <SheetContent className="border-white/10 bg-[#101114] text-white sm:max-w-md">
                <SheetHeader className="border-b border-white/10 p-6"><SheetTitle className="text-xl text-white">ตะกร้าสินค้า</SheetTitle><SheetDescription>ตรวจสอบรายการก่อนดำเนินการสั่งซื้อ</SheetDescription></SheetHeader>
                <div className="flex-1 space-y-3 overflow-y-auto px-6">
                  {cartItems.length === 0 ? <div className="grid h-56 place-items-center text-center text-zinc-500"><div><ShoppingBag className="mx-auto mb-3 size-8"/><p>ยังไม่มีสินค้าในตะกร้า</p></div></div> : cartItems.map((product) => <div key={product.id} className="flex items-center gap-3 border-b border-white/8 py-4"><div className="relative size-16 overflow-hidden bg-zinc-900"><Image src="/mecha-hero.png" alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: product.position }}/></div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{product.name}</p><p className="text-sm text-zinc-500">฿{product.price.toLocaleString()}</p></div><div className="flex items-center gap-2"><Button variant="outline" size="icon-xs" onClick={() => updateCart(product.id, -1)}><Minus /></Button><span>{cart[product.id]}</span><Button variant="outline" size="icon-xs" onClick={() => updateCart(product.id, 1)}><Plus /></Button></div></div>)}
                </div>
                <SheetFooter className="border-t border-white/10 p-6"><div className="mb-3 flex items-end justify-between"><span className="text-zinc-400">ยอดรวม</span><strong className="text-2xl">฿{total.toLocaleString()}</strong></div><Button disabled={!cartCount} className="h-12 bg-red-600 text-white hover:bg-red-500">ดำเนินการสั่งซื้อ <ArrowRight /></Button></SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section id="top" className="relative min-h-[620px] border-b border-white/8">
        <Image src="/mecha-hero.png" alt="โมเดลหุ่นยนต์ดีไซน์ล้ำสมัยสามตัวบนแท่นจัดแสดง" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090b_4%,rgba(8,9,11,.94)_32%,rgba(8,9,11,.25)_72%,rgba(8,9,11,.55))]" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 lg:px-8"><div className="max-w-xl"><Badge className="mb-6 rounded-none border border-red-500/30 bg-red-500/10 px-3 py-1 text-red-400">NEW ARRIVAL · SEPTEMBER DROP</Badge><h1 className="text-5xl font-black leading-[.94] tracking-[-.045em] sm:text-7xl">BUILD YOUR<br/><span className="text-red-500">NEXT LEGEND.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-zinc-400 sm:text-lg">คัดสรรโมเดลเกรดคุณภาพสำหรับนักสะสม พร้อมส่งจากคลังไทย ตรวจสภาพกล่องก่อนจัดส่งทุกชิ้น</p><div className="mt-8 flex flex-wrap gap-3"><Button className="h-12 bg-red-600 px-6 text-white hover:bg-red-500" onClick={() => document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })}>เลือกซื้อสินค้า <ArrowRight /></Button><Button variant="outline" className="h-12 border-white/15 bg-black/20 px-6 text-white">ดูสินค้าเข้าใหม่</Button></div></div></div>
      </section>

      <section className="border-b border-white/8 bg-[#0d0e11]"><div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/8 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">{[{icon: ShieldCheck, title: 'ของแท้ 100%', text: 'รับประกันสินค้าจากตัวแทนจำหน่าย'}, {icon: Box, title: 'แพ็กอย่างมืออาชีพ', text: 'กันกระแทกและตรวจสภาพก่อนส่ง'}, {icon: Truck, title: 'ส่งฟรีเมื่อครบ ฿1,500', text: 'จัดส่งทั่วประเทศพร้อมเลขติดตาม'}].map(({icon: Icon, title, text}) => <div key={title} className="flex items-center gap-4 py-6 sm:px-6 first:pl-0"><Icon className="size-6 text-red-500"/><div><p className="font-semibold">{title}</p><p className="text-sm text-zinc-500">{text}</p></div></div>)}</div></section>

      <section id="products" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="mb-2 flex items-center gap-2 text-sm font-bold tracking-[.18em] text-red-500"><Sparkles className="size-4"/> FEATURED KITS</p><h2 className="text-3xl font-black sm:text-4xl">โมเดลแนะนำ</h2></div><div className="flex flex-col gap-3 sm:flex-row"><label className="flex h-11 items-center gap-2 border border-white/10 bg-[#111216] px-4 focus-within:border-red-500/70"><Search className="size-4 text-zinc-500"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาสินค้า" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"/></label><div id="grades" className="flex gap-1 overflow-x-auto">{grades.map((grade) => <Button key={grade} variant={selectedGrade === grade ? 'default' : 'ghost'} className={selectedGrade === grade ? 'bg-red-600 text-white hover:bg-red-500' : 'text-zinc-400'} onClick={() => setSelectedGrade(grade)}>{grade}</Button>)}</div></div></div>
        {visibleProducts.length ? <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => <article key={product.id} className="group"><div className="relative aspect-[4/5] overflow-hidden border border-white/8 bg-[#121317]"><Image src="/mecha-hero.png" alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="scale-[1.7] object-cover grayscale-[20%] transition duration-500 group-hover:scale-[1.82] group-hover:grayscale-0" style={{ objectPosition: product.position }}/><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"/>{product.tag && <Badge className="absolute left-3 top-3 rounded-none bg-red-600 text-white">{product.tag}</Badge>}<Button aria-label={`เพิ่ม ${product.name} ลงตะกร้า`} onClick={() => updateCart(product.id, 1)} className="absolute bottom-3 right-3 size-11 bg-white p-0 text-black opacity-100 hover:bg-red-500 hover:text-white lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"><Plus/></Button></div><div className="pt-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.15em] text-red-500">{product.grade}</p><h3 className="mt-1 font-bold">{product.name}</h3></div><p className="font-black">฿{product.price.toLocaleString()}</p></div><p className="mt-2 text-sm text-zinc-600">เหลือ {product.stock} ชิ้น</p></div></article>)}</div> : <div className="border border-dashed border-white/15 py-20 text-center text-zinc-500">ไม่พบสินค้าที่ค้นหา</div>}
      </section>
      <footer className="border-t border-white/8 bg-[#07080a] py-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 text-sm text-zinc-600 sm:flex-row lg:px-8"><p>© 2026 MECHA VAULT — ร้านโมเดลสำหรับนักสะสม</p><p>หน้าร้านตัวอย่าง · ราคายังไม่รวมค่าจัดส่ง</p></div></footer>
    </main>
  );
}
