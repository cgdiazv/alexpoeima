import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo-script.webp"
          alt="Alexpoeima"
          width={180}
          height={45}
          className="h-8 w-auto object-contain dark:invert"
          priority
        />
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
