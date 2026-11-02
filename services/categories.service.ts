import "server-only";
import { getAdminFirestore } from "./firebase/admin";
import { slugify } from "@/lib/utils";
import type {
  Category,
  CategoryFormInput,
  SubCategory,
  SubCategoryFormInput,
} from "@/models/category";

const CATEGORIES = "categories";
const SUBCATEGORIES = "subcategories";
const PRODUCTS = "products";

export class CategoryInUseError extends Error {}
export class DuplicateSlugError extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCategory(id: string, data: any): Category {
  return {
    id,
    name: data.name,
    slug: data.slug,
    order: data.order ?? 0,
    active: data.active ?? true,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? "",
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSubCategory(id: string, data: any): SubCategory {
  return {
    id,
    name: data.name,
    slug: data.slug,
    categorySlug: data.categorySlug,
    order: data.order ?? 0,
    active: data.active ?? true,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? "",
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? "",
  };
}

export async function listCategories(): Promise<Category[]> {
  const snap = await getAdminFirestore().collection(CATEGORIES).get();
  return snap.docs.map((d) => toCategory(d.id, d.data())).sort((a, b) => a.order - b.order);
}

export async function listActiveCategories(): Promise<Category[]> {
  return (await listCategories()).filter((c) => c.active);
}

export async function listSubCategories(): Promise<SubCategory[]> {
  const snap = await getAdminFirestore().collection(SUBCATEGORIES).get();
  return snap.docs
    .map((d) => toSubCategory(d.id, d.data()))
    .sort((a, b) => a.order - b.order);
}

export async function listActiveSubCategories(): Promise<SubCategory[]> {
  return (await listSubCategories()).filter((s) => s.active);
}

export async function createCategory(input: CategoryFormInput): Promise<string> {
  const db = getAdminFirestore();
  const slug = slugify(input.name);
  if (!slug) throw new Error("Nome de categoria inválido.");

  const existing = await db.collection(CATEGORIES).where("slug", "==", slug).limit(1).get();
  if (!existing.empty) throw new DuplicateSlugError("Já existe uma categoria com esse nome.");

  const countSnap = await db.collection(CATEGORIES).count().get();
  const docRef = db.collection(CATEGORIES).doc();
  await docRef.set({
    name: input.name,
    slug,
    active: input.active,
    order: countSnap.data().count,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, input: CategoryFormInput): Promise<void> {
  await getAdminFirestore()
    .collection(CATEGORIES)
    .doc(id)
    .update({ name: input.name, active: input.active, updatedAt: new Date() });
}

/** Refuses to delete a category still referenced by subcategories or products. */
export async function deleteCategory(id: string): Promise<void> {
  const db = getAdminFirestore();
  const doc = await db.collection(CATEGORIES).doc(id).get();
  if (!doc.exists) return;
  const slug = doc.data()?.slug as string;

  const [subsSnap, productsSnap] = await Promise.all([
    db.collection(SUBCATEGORIES).where("categorySlug", "==", slug).limit(1).get(),
    db.collection(PRODUCTS).where("category", "==", slug).limit(1).get(),
  ]);

  if (!subsSnap.empty || !productsSnap.empty) {
    throw new CategoryInUseError(
      "Essa categoria tem subcategorias ou produtos vinculados. Remova-os antes de excluir."
    );
  }

  await db.collection(CATEGORIES).doc(id).delete();
}

export async function createSubCategory(input: SubCategoryFormInput): Promise<string> {
  const db = getAdminFirestore();
  const slug = slugify(input.name);
  if (!slug) throw new Error("Nome de subcategoria inválido.");

  const existing = await db
    .collection(SUBCATEGORIES)
    .where("categorySlug", "==", input.categorySlug)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (!existing.empty) {
    throw new DuplicateSlugError("Já existe uma subcategoria com esse nome nessa categoria.");
  }

  const countSnap = await db.collection(SUBCATEGORIES).count().get();
  const docRef = db.collection(SUBCATEGORIES).doc();
  await docRef.set({
    name: input.name,
    slug,
    categorySlug: input.categorySlug,
    active: input.active,
    order: countSnap.data().count,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updateSubCategory(
  id: string,
  input: SubCategoryFormInput
): Promise<void> {
  await getAdminFirestore()
    .collection(SUBCATEGORIES)
    .doc(id)
    .update({
      name: input.name,
      categorySlug: input.categorySlug,
      active: input.active,
      updatedAt: new Date(),
    });
}

export async function deleteSubCategory(id: string): Promise<void> {
  const db = getAdminFirestore();
  const doc = await db.collection(SUBCATEGORIES).doc(id).get();
  if (!doc.exists) return;
  const slug = doc.data()?.slug as string;
  const categorySlug = doc.data()?.categorySlug as string;

  const productsSnap = await db
    .collection(PRODUCTS)
    .where("category", "==", categorySlug)
    .where("subCategory", "==", slug)
    .limit(1)
    .get();

  if (!productsSnap.empty) {
    throw new CategoryInUseError(
      "Essa subcategoria tem produtos vinculados. Mova ou remova os produtos antes de excluir."
    );
  }

  await db.collection(SUBCATEGORIES).doc(id).delete();
}
