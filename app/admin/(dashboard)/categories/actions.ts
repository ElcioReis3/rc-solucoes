"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/services/auth.service";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  updateCategory,
  updateSubCategory,
} from "@/services/categories.service";
import { categoryFormSchema, subCategoryFormSchema } from "@/lib/validation";

/**
 * Devolve { error } em vez de lançar throw quando a validação falha — o Next apaga a mensagem de
 * qualquer erro lançado (throw) dentro de uma Server Action em produção, deixando só um
 * "An error occurred..." genérico na tela. Devolvendo o erro como valor normal, a mensagem certa
 * chega até o admin.
 */
export type ActionResult = { error: string } | undefined;

function parseCategoryForm(formData: FormData): { data: { name: string; active: boolean } } | { error: string } {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  return { data: parsed.data };
}

function parseSubCategoryForm(
  formData: FormData
): { data: { name: string; categorySlug: string; active: boolean } } | { error: string } {
  const parsed = subCategoryFormSchema.safeParse({
    name: formData.get("name"),
    categorySlug: formData.get("categorySlug"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  return { data: parsed.data };
}

function revalidateCatalog() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseCategoryForm(formData);
  if ("error" in parsed) return { error: parsed.error };
  await createCategory(parsed.data);
  revalidateCatalog();
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseCategoryForm(formData);
  if ("error" in parsed) return { error: parsed.error };
  await updateCategory(id, parsed.data);
  revalidateCatalog();
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await deleteCategory(id);
  revalidateCatalog();
}

export async function createSubCategoryAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseSubCategoryForm(formData);
  if ("error" in parsed) return { error: parsed.error };
  await createSubCategory(parsed.data);
  revalidateCatalog();
}

export async function updateSubCategoryAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseSubCategoryForm(formData);
  if ("error" in parsed) return { error: parsed.error };
  await updateSubCategory(id, parsed.data);
  revalidateCatalog();
}

export async function deleteSubCategoryAction(id: string) {
  await requireAdmin();
  await deleteSubCategory(id);
  revalidateCatalog();
}
