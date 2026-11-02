import Image from "next/image";
import Link from "next/link";
import { CartSheet } from "@/components/CartSheet";
import { Footer } from "@/components/layout/footer";
import { ProductFilters } from "@/components/products/product-filters";
import { listActiveProducts } from "@/services/products.service";
import { listActiveCategories, listActiveSubCategories } from "@/services/categories.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catálogo - RC Soluções" };

export default async function PortfolioPage() {
  const [products, categories, subCategories] = await Promise.all([
    listActiveProducts(),
    listActiveCategories(),
    listActiveSubCategories(),
  ]);

  return (
    <>
      <div className="w-full mx-auto px-4 py-10 bg-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/assets/images/logo-tipo-light.png"
              width={130}
              height={100}
              alt="RC Soluções"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center border-t border-blue-200 pt-6">
            Catálogo de Produtos
          </h1>

          <ProductFilters products={products} categories={categories} subCategories={subCategories} />

          <p className="text-center text-sm text-muted-foreground mt-12">
            Não encontrou o que precisa? Entre em contato para apresentação completa do catálogo.
          </p>
        </div>
      </div>

      <CartSheet />
      <Footer />
    </>
  );
}
