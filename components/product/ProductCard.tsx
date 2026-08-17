import Link from "next/link";

export function ProductCard({ title = "Example Product", slug = "example-product", price = 19.99 }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600">${price.toFixed(2)}</p>
      <Link href={`/products/${slug}`} className="text-blue-600 hover:underline mt-2 inline-block">
        View Details
      </Link>
    </div>
  );
}
