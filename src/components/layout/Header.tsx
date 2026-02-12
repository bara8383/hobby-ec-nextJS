import Link from "next/link";

const navItems = [
  { href: "/products", label: "商品一覧" },
  { href: "/cart", label: "カート" },
  { href: "/checkout", label: "チェックアウト" },
  { href: "/chat", label: "チャット" }
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Digital Assets EC
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
