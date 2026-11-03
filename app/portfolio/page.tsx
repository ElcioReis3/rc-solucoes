import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CartSheet } from "@/components/CartSheet";
import { Footer } from "@/components/layout/footer";
import { ProductFilters } from "@/components/products/product-filters";
import { CatalogAutoRefresh } from "@/components/products/catalog-auto-refresh";
import { listActiveProducts } from "@/services/products.service";
import { listActiveCategories, listActiveSubCategories } from "@/services/categories.service";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ produto?: string }>;

const DEFAULT_METADATA: Metadata = { title: "Catálogo - RC Soluções" };

/**
 * Quando o link vem com ?produto=<id> (de um compartilhamento), usa a foto, o título e a
 * descrição DAQUELE produto nas meta tags — é isso que o WhatsApp, Instagram, etc. leem pra
 * montar a prévia do link antes mesmo de alguém abrir a página. Sem isso, qualquer link
 * compartilhado mostrava sempre a logo genérica do site, nunca a foto do produto de verdade.
 */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { produto } = await searchParams;
  if (!produto) return DEFAULT_METADATA;

  const products = await listActiveProducts();
  const product = products.find((p) => p.id === produto);
  if (!product) return DEFAULT_METADATA;

  const cover = product.images[0]?.url;

  return {
    title: `${product.title} - RC Soluções`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
      images: cover ? [{ url: cover, width: 800, height: 800, alt: product.title }] : undefined,
    },
  };
}

export default async function PortfolioPage() {
  const [products, categories, subCategories] = await Promise.all([
    listActiveProducts(),
    listActiveCategories(),
    listActiveSubCategories(),
  ]);

  return (
    <>
      <CatalogAutoRefresh />
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

          {/* ProductFilters lê ?produto= da URL (pra abrir direto um produto compartilhado), o que
              exige essa borda de Suspense — sem ela o Next recusa o build. */}
          <Suspense fallback={null}>
            <ProductFilters products={products} categories={categories} subCategories={subCategories} />
          </Suspense>

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
