"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/services/auth.service";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
  reorderProductImages,
  setProductActive,
  getProduct,
} from "@/services/products.service";
import { listSubCategories } from "@/services/categories.service";
import { assertCanCreateProduct, ProductLimitReachedError } from "@/services/plan.service";
import { productFormSchema } from "@/lib/validation";
import type { ProductImage, ProductFormInput } from "@/models/product";

/**
 * Toda action que pode falhar por um motivo "esperado" (campo inválido, limite do plano etc.)
 * devolve isso em vez de lançar um throw — o Next apaga a mensagem de qualquer erro lançado
 * (throw) dentro de uma Server Action em produção, deixando só um "An error occurred..." genérico
 * pro admin. Devolvendo o erro como valor normal, a mensagem certa chega até a tela.
 */
export type ActionResult = { error: string } | undefined;

async function parseProductForm(
  formData: FormData
): Promise<{ data: ProductFormInput } | { error: string }> {
  const parsed = productFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    subCategory: formData.get("subCategory"),
    active: formData.get("active") === "on",
    showPrice: formData.get("showPrice") === "on",
    price: formData.get("price") || undefined,
    promoPrice: formData.get("promoPrice") || undefined,
    showWholesale: formData.get("showWholesale") === "on",
    minWholesaleQty: formData.get("minWholesaleQty") || undefined,
    wholesaleDiscountPercent: formData.get("wholesaleDiscountPercent") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // Make sure the submitted category/subcategory slugs actually exist and match each other.
  const subCategories = await listSubCategories();
  const match = subCategories.find(
    (s) => s.slug === parsed.data.subCategory && s.categorySlug === parsed.data.category
  );
  if (!match) {
    return { error: "Categoria/subcategoria inválida. Atualize a página e tente de novo." };
  }

  // Drop stale values for whichever optional section the admin left switched off.
  return {
    data: {
      ...parsed.data,
      price: parsed.data.showPrice ? parsed.data.price : undefined,
      promoPrice: parsed.data.showPrice ? parsed.data.promoPrice : undefined,
      minWholesaleQty: parsed.data.showWholesale ? parsed.data.minWholesaleQty : undefined,
      wholesaleDiscountPercent: parsed.data.showWholesale
        ? parsed.data.wholesaleDiscountPercent
        : undefined,
    },
  };
}

function getImageFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  try {
    await assertCanCreateProduct();
  } catch (err) {
    if (err instanceof ProductLimitReachedError) return { error: err.message };
    throw err;
  }

  const parsed = await parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const images = getImageFiles(formData);
  if (images.length === 0) {
    return { error: "Adicione pelo menos uma foto do produto." };
  }

  const id = await createProduct(parsed.data, images);
  revalidatePath("/admin/products");
  revalidatePath("/portfolio");
  revalidatePath("/");
  // Land on the new product's own edit screen (not the list) so the admin can immediately add
  // the remaining photos or reorder them, instead of having to find it again from the list.
  redirect(`/admin/products/${id}`);
}

export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = await parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const images = getImageFiles(formData);

  await updateProduct(id, parsed.data, images);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/portfolio");
  revalidatePath("/");
  // Deliberately no redirect: stays on the edit screen so newly uploaded photos immediately
  // show up (with working reorder/remove) instead of forcing a save -> list -> reopen round trip.
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await setProductActive(id, active);
  revalidatePath("/admin/products");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function removeProductImageAction(id: string, path: string) {
  await requireAdmin();
  await removeProductImage(id, path);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/portfolio");
}

export async function moveProductImageAction(
  id: string,
  path: string,
  direction: "up" | "down"
) {
  await requireAdmin();
  const product = await getProduct(id);
  if (!product) throw new Error("Produto não encontrado.");

  const images = [...product.images];
  const index = images.findIndex((img) => img.path === path);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= images.length) return;

  [images[index], images[swapWith]] = [images[swapWith], images[index]];

  const reordered: ProductImage[] = images;
  await reorderProductImages(id, reordered);
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/portfolio");
}
