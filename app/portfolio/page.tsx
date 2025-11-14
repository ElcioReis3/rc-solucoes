import { ProductCard } from "@/components/ProductCard";
import { ListProducts } from "@/data/product";

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Catálogo de Produtos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center">
          {ListProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
