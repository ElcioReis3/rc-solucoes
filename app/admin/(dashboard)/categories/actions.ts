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

function parseCategoryForm(formData: FormData) {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}

function parseSubCategoryForm(formData: FormData) {
  const parsed = subCategoryFormSchema.safeParse({
    name: formData.get("name"),
    categorySlug: formData.get("categorySlug"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}

function revalidateCatalog() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  await createCategory(parseCategoryForm(formData));
  revalidateCatalog();
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateCategory(id, parseCategoryForm(formData));
  revalidateCatalog();
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await deleteCategory(id);
  revalidateCatalog();
}

export async function createSubCategoryAction(formData: FormData) {
  await requireAdmin();
  await createSubCategory(parseSubCategoryForm(formData));
  revalidateCatalog();
}

export async function updateSubCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateSubCategory(id, parseSubCategoryForm(formData));
  revalidateCatalog();
}

export async function deleteSubCategoryAction(id: string) {
  await requireAdmin();
  await deleteSubCategory(id);
  revalidateCatalog();
}
