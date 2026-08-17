import Link from "next/link";

export function Header() {
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Storefront
      </Link>
      <nav>
        <ul className="flex gap-4">
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/cart">Cart</Link></li>
        </ul>
      </nav>
    </header>
  );
}
