"use client";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/ProductCard";
import { ListProducts } from "@/data/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const cleaningProducts = ListProducts.filter((p) => p.category === "limpeza");
  const officeProducts = ListProducts.filter(
    (p) => p.category === "expediente"
  );

  return (
    <>
      <div className="w-full mx-auto px-4 py-8 bg-blue-50">
        <Image
          src={"/assets/images/logo-tipo-light.png"}
          width={130}
          height={100}
          alt="Logo"
          className="mx-auto mb-4 "
          onClick={() => router.push("/")}
        />
        <h1 className="text-xl md:text-2xl font-bold mb-8 text-center border-t border-blue-300 pt-4">
          Catálogo de Produtos
        </h1>

        <h2 className="text-lg md:text-xl font-semibold mb-3">Limpeza</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center mb-8">
          {cleaningProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <h2 className="text-lg md:text-xl font-semibold mb-3">Expediente</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center">
          {officeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
