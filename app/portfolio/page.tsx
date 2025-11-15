"use client";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/ProductCard";
import { ListProducts } from "@/data/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center">
          {ListProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
