import { ProductForm } from "@/components/admin/product-form";
import { PlanLimitNotice } from "@/components/admin/plan-limit-notice";
import { listCategories, listSubCategories } from "@/services/categories.service";
import { getPlanInfo } from "@/services/plan.service";
import { createProductAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo Produto - Painel Admin" };

export default async function NewProductPage() {
  const [categories, subCategories, plan] = await Promise.all([
    listCategories(),
    listSubCategories(),
    getPlanInfo(),
  ]);

  const limitReached = plan.productCount >= plan.productLimit;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Novo produto</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados e envie até 3 fotos.
        </p>
      </div>

      {limitReached ? (
        <PlanLimitNotice plan={plan} />
      ) : (
        <ProductForm categories={categories} subCategories={subCategories} action={createProductAction} />
      )}
    </div>
  );
}
