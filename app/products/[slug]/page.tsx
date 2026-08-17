export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Detail: {slug}</h1>
      {/* Product details go here */}
    </main>
  );
}
