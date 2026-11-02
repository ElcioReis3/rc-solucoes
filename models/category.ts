/**
 * Categories and subcategories are managed by the admin (Firestore-backed),
 * not hardcoded. Products reference them by `slug` (not Firestore doc id),
 * so the already-imported catalog (category: "limpeza", subCategory: "papel", ...)
 * keeps working as long as the matching category/subcategory slugs exist.
 */

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  /** Slug of the parent category. */
  categorySlug: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFormInput = {
  name: string;
  active: boolean;
};

export type SubCategoryFormInput = {
  name: string;
  categorySlug: string;
  active: boolean;
};
