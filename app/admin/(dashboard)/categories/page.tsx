import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories, listSubCategories } from "@/services/categories.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categorias - Painel Admin" };

export default async function AdminCategoriesPage() {
  const [categories, subCategories] = await Promise.all([
    listCategories(),
    listSubCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categorias e Subcategorias</h1>
        <p className="text-sm text-muted-foreground">
          Organize como os produtos aparecem no catálogo. Clique no nome para renomear.
        </p>
      </div>

      <CategoryManager categories={categories} subCategories={subCategories} />
    </div>
  );
}
