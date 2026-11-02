import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsExplorer } from "@/components/admin/products-explorer";
import { listAllProducts } from "@/services/products.service";
import { listCategories, listSubCategories } from "@/services/categories.service";
import { getPlanInfo } from "@/services/plan.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos - Painel Admin" };

export default async function AdminProductsPage() {
  // DIAGNÓSTICO TEMPORÁRIO: loga cada busca separada, pra achar qual trava. Pode remover depois.
  const diag = async <T,>(label: string, p: Promise<T>): Promise<T> => {
    console.log(`[diag] ${label}: começando...`);
    const result = await p;
    console.log(`[diag] ${label}: OK`);
    return result;
  };

  const [products, categories, subCategories, plan] = await Promise.all([
    diag("listAllProducts", listAllProducts()),
    diag("listCategories", listCategories()),
    diag("listSubCategories", listSubCategories()),
    diag("getPlanInfo", getPlanInfo()),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo exibido no site.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/products/new">
            <Plus size={18} />
            Novo produto
          </Link>
        </Button>
      </div>

      <ProductsExplorer
        products={products}
        categories={categories}
        subCategories={subCategories}
        plan={plan}
      />
    </div>
  );
}
