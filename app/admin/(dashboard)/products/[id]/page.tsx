import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProduct } from "@/services/products.service";
import { listCategories, listSubCategories } from "@/services/categories.service";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar Produto - Painel Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, subCategories] = await Promise.all([
    getProduct(id),
    listCategories(),
    listSubCategories(),
  ]);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar produto</h1>
        <p className="text-sm text-muted-foreground">{product.title}</p>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        subCategories={subCategories}
        action={boundAction}
      />
    </div>
  );
}
