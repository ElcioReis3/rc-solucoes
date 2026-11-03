import "server-only";
import { cache } from "react";
import { getAdminFirestore } from "./firebase/admin";
import { deleteImage, uploadImage } from "./storage.service";
import {
  MAX_PRODUCT_IMAGES,
  type Product,
  type ProductFormInput,
  type ProductImage,
} from "@/models/product";

const COLLECTION = "products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProduct(id: string, data: any): Product {
  return {
    id,
    title: data.title,
    description: data.description,
    images: data.images ?? [],
    category: data.category,
    subCategory: data.subCategory,
    order: data.order ?? 0,
    active: data.active ?? true,
    showPrice: data.showPrice ?? false,
    price: data.price ?? undefined,
    promoPrice: data.promoPrice ?? undefined,
    showWholesale: data.showWholesale ?? false,
    minWholesaleQty: data.minWholesaleQty ?? undefined,
    wholesaleDiscountPercent: data.wholesaleDiscountPercent ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? "",
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? "",
  };
}

/** Alphabetical, accent-insensitive title sort — keeps the catalog browsable regardless of
 *  insertion order, rather than showing newest/last-added products first. */
function byTitle(a: Product, b: Product): number {
  return a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" });
}

/**
 * Public read: only active products, used by the storefront. `cache()` faz essa busca no
 * Firestore rodar só uma vez por requisição — a página do catálogo e o generateMetadata (pra
 * montar a prévia do link quando um produto é compartilhado) chamam essa função sem duplicar a
 * consulta.
 */
export const listActiveProducts = cache(async (): Promise<Product[]> => {
  const snap = await getAdminFirestore()
    .collection(COLLECTION)
    .where("active", "==", true)
    .get();

  return snap.docs.map((doc) => toProduct(doc.id, doc.data())).sort(byTitle);
});

/** Admin read: everything, including inactive products. */
export async function listAllProducts(): Promise<Product[]> {
  const snap = await getAdminFirestore().collection(COLLECTION).get();
  return snap.docs.map((doc) => toProduct(doc.id, doc.data())).sort(byTitle);
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await getAdminFirestore().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return toProduct(doc.id, doc.data());
}

export async function createProduct(
  input: ProductFormInput,
  images: File[]
): Promise<string> {
  const db = getAdminFirestore();
  const docRef = db.collection(COLLECTION).doc();

  const uploaded = await uploadImagesLimited(images, `products/${docRef.id}`);
  const countSnap = await db.collection(COLLECTION).count().get();

  await docRef.set({
    ...input,
    images: uploaded,
    order: countSnap.data().count,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

export async function updateProduct(
  id: string,
  input: ProductFormInput,
  newImages: File[]
): Promise<void> {
  const db = getAdminFirestore();
  const docRef = db.collection(COLLECTION).doc(id);
  const existing = await getProduct(id);
  if (!existing) throw new Error("Produto não encontrado.");

  const uploaded = await uploadImagesLimited(
    newImages,
    `products/${id}`,
    existing.images.length
  );

  await docRef.update({
    ...input,
    images: [...existing.images, ...uploaded],
    updatedAt: new Date(),
  });
}

/** Removes one image from a product, both in Firestore and in Storage. */
export async function removeProductImage(id: string, path: string): Promise<void> {
  const db = getAdminFirestore();
  const docRef = db.collection(COLLECTION).doc(id);
  const existing = await getProduct(id);
  if (!existing) throw new Error("Produto não encontrado.");

  const remaining = existing.images.filter((img) => img.path !== path);
  await docRef.update({ images: remaining, updatedAt: new Date() });
  await deleteImage(path);
}

/** Replaces the full image order (drag/reorder or move up/down in the admin UI). */
export async function reorderProductImages(
  id: string,
  images: ProductImage[]
): Promise<void> {
  await getAdminFirestore()
    .collection(COLLECTION)
    .doc(id)
    .update({ images, updatedAt: new Date() });
}

export async function setProductActive(id: string, active: boolean): Promise<void> {
  await getAdminFirestore()
    .collection(COLLECTION)
    .doc(id)
    .update({ active, updatedAt: new Date() });
}

export async function deleteProduct(id: string): Promise<void> {
  const existing = await getProduct(id);
  if (!existing) return;

  await Promise.all(existing.images.map((img) => deleteImage(img.path)));
  await getAdminFirestore().collection(COLLECTION).doc(id).delete();
}

async function uploadImagesLimited(
  files: File[],
  folder: string,
  existingCount = 0
): Promise<ProductImage[]> {
  const slotsLeft = Math.max(0, MAX_PRODUCT_IMAGES - existingCount);
  const toUpload = files.filter((f) => f.size > 0).slice(0, slotsLeft);
  return Promise.all(toUpload.map((file) => uploadImage(file, folder)));
}
